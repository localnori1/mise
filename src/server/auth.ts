// Owner sign-in with Google (ADR-003). Respondents never sign in; their share
// link is their credential. Owners get a random login token in an httpOnly
// cookie; only its hash is stored (table `logins`).
import { Hono, type Context } from "hono";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import type { Me } from "../shared/api";
import { AppError } from "./sessions";
import { newToken } from "./store";

export type Env = Cloudflare.Env & {
  IP_HASH_SALT?: string;
  GOOGLE_CLIENT_SECRET?: string;
  DEV_LOGIN?: string; // "1" in .dev.vars only: localhost sign-in without Google
};
type Ctx = Context<{ Bindings: Env }>;
export type Owner = { owner_key: string; name: string | null; email: string | null };

const FLOW_COOKIE = "mise_oauth";
const LOGIN_DAYS = 30;
const DAY_MS = 86_400_000;

const isHttps = (c: Ctx) => new URL(c.req.url).protocol === "https:";
// __Host- (https only) stops a sibling subdomain from planting a login cookie.
const loginCookie = (c: Ctx) => (isHttps(c) ? "__Host-mise_login" : "mise_login");
const isLocal = (c: Ctx) => ["localhost", "127.0.0.1"].includes(new URL(c.req.url).hostname);

async function sha256(text: string): Promise<Uint8Array> {
  return new Uint8Array(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}
const hex = (bytes: Uint8Array) => [...bytes].map((b) => b.toString(16).padStart(2, "0")).join("");
const base64url = (bytes: Uint8Array) =>
  btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");

// Only paths on this site, so sign-in can't be used to redirect elsewhere.
// Resolving against the origin catches tricks like "/	/evil.example".
export function safeNext(next: unknown, origin: string): string {
  if (typeof next !== "string" || !next.startsWith("/")) return "/links";
  try {
    const url = new URL(next, origin);
    const path = url.pathname + url.search + url.hash;
    // "/.//evil.example" normalises to "//evil.example", protocol-relative.
    return url.origin === origin && !path.startsWith("//") ? path : "/links";
  } catch {
    return "/links";
  }
}

export async function currentOwner(c: Ctx): Promise<Owner | null> {
  const token = getCookie(c, loginCookie(c));
  if (!token) return null;
  return c.env.DB.prepare(
    `SELECT o.owner_key, o.name, o.email FROM logins l JOIN owners o ON o.owner_key = l.owner_key
     WHERE l.token_hash = ? AND l.expires_at > ?`,
  )
    .bind(hex(await sha256(token)), new Date().toISOString())
    .first<Owner>();
}

export async function requireOwner(c: Ctx): Promise<Owner> {
  const owner = await currentOwner(c);
  if (!owner) throw new AppError(401, "unauthorized", "Sign in to continue.");
  return owner;
}

// Finds or creates the owner for this Google account, then signs the browser in.
async function signIn(c: Ctx, profile: { sub: string; name: string | null; email: string | null }, next: string) {
  const db = c.env.DB;
  const now = new Date();
  const owner = await db
    .prepare(
      `INSERT INTO owners (owner_key, created_at, google_sub, name, email) VALUES (?, ?, ?, ?, ?)
       ON CONFLICT (google_sub) DO UPDATE SET name = excluded.name, email = excluded.email
       RETURNING owner_key`,
    )
    .bind(newToken(), now.toISOString(), profile.sub, profile.name, profile.email)
    .first<{ owner_key: string }>();
  const token = newToken();
  await db
    .prepare("INSERT INTO logins (token_hash, owner_key, created_at, expires_at) VALUES (?, ?, ?, ?)")
    .bind(hex(await sha256(token)), owner!.owner_key, now.toISOString(), new Date(now.getTime() + LOGIN_DAYS * DAY_MS).toISOString())
    .run();
  setCookie(c, loginCookie(c), token, {
    httpOnly: true,
    secure: isHttps(c),
    sameSite: "Lax",
    path: "/",
    maxAge: LOGIN_DAYS * 86_400,
  });
  return c.redirect(next);
}

export const auth = new Hono<{ Bindings: Env }>();

// Starts Google sign-in (authorization code flow with PKCE and a state check).
auth.get("/auth/google", async (c) => {
  const next = safeNext(c.req.query("next"), new URL(c.req.url).origin);
  if (!c.env.GOOGLE_CLIENT_ID || !c.env.GOOGLE_CLIENT_SECRET) {
    if (c.env.DEV_LOGIN === "1" && isLocal(c)) {
      return signIn(c, { sub: "dev-local", name: "Local tester", email: null }, next);
    }
    return c.text("Sign-in isn't set up yet.", 503);
  }
  const state = newToken();
  const verifier = newToken() + newToken();
  setCookie(c, FLOW_COOKIE, JSON.stringify({ state, verifier, next }), {
    httpOnly: true,
    secure: isHttps(c),
    sameSite: "Lax", // sent on Google's redirect back, a top-level GET
    path: "/auth",
    maxAge: 600,
  });
  const params = new URLSearchParams({
    client_id: c.env.GOOGLE_CLIENT_ID,
    redirect_uri: `${new URL(c.req.url).origin}/auth/google/callback`,
    response_type: "code",
    scope: "openid email profile",
    state,
    code_challenge: base64url(await sha256(verifier)),
    code_challenge_method: "S256",
    prompt: "select_account",
  });
  return c.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params}`);
});

auth.get("/auth/google/callback", async (c) => {
  const failed = () => c.redirect("/?signin=failed");
  let flow: { state?: string; verifier?: string; next?: string } = {};
  try {
    flow = JSON.parse(getCookie(c, FLOW_COOKIE) ?? "{}");
  } catch {
    // Treated as a missing flow below.
  }
  deleteCookie(c, FLOW_COOKIE, { path: "/auth" });
  const code = c.req.query("code");
  if (!code || !flow.state || !flow.verifier || c.req.query("state") !== flow.state) return failed();

  const res = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "content-type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: c.env.GOOGLE_CLIENT_ID,
      client_secret: c.env.GOOGLE_CLIENT_SECRET ?? "",
      redirect_uri: `${new URL(c.req.url).origin}/auth/google/callback`,
      grant_type: "authorization_code",
      code_verifier: flow.verifier,
    }),
  }).catch(() => null);
  if (!res?.ok) {
    console.error("Google token exchange failed", res?.status ?? "network");
    return failed();
  }
  // The ID token came straight from Google's token endpoint over TLS, so its
  // claims are checked without verifying the signature (OpenID Connect 3.1.3.7).
  let claims: { iss?: string; aud?: string; exp?: number; sub?: string; email?: string; email_verified?: boolean; name?: string };
  try {
    const { id_token } = (await res.json()) as { id_token?: string };
    const payload = id_token!.split(".")[1].replace(/-/g, "+").replace(/_/g, "/");
    claims = JSON.parse(new TextDecoder().decode(Uint8Array.from(atob(payload), (ch) => ch.charCodeAt(0))));
  } catch {
    return failed();
  }
  const validIssuer = claims.iss === "https://accounts.google.com" || claims.iss === "accounts.google.com";
  if (!validIssuer || claims.aud !== c.env.GOOGLE_CLIENT_ID || !claims.sub || (claims.exp ?? 0) * 1000 < Date.now()) {
    return failed();
  }
  return signIn(
    c,
    { sub: claims.sub, name: claims.name?.slice(0, 80) ?? null, email: claims.email_verified ? (claims.email ?? null) : null },
    safeNext(flow.next, new URL(c.req.url).origin),
  );
});

auth.get("/api/me", async (c) => {
  const owner = await currentOwner(c);
  return c.json<Me>({ owner: owner ? { name: owner.name, email: owner.email } : null });
});

auth.post("/api/auth/logout", async (c) => {
  const token = getCookie(c, loginCookie(c));
  if (token) await c.env.DB.prepare("DELETE FROM logins WHERE token_hash = ?").bind(hex(await sha256(token))).run();
  deleteCookie(c, loginCookie(c), { path: "/", secure: isHttps(c) });
  return c.json<Me>({ owner: null });
});
