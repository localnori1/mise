import { useEffect, useState } from "react";
import type { Me } from "../shared/api";
import { api, RequestError } from "./api";
import { Card } from "./components/Card";

type Owner = NonNullable<Me["owner"]>;

// One /api/me request per page load, shared by every screen that asks.
let pending: Promise<Owner | null> | null = null;

// undefined while loading, null when signed out.
export function useOwner(): [Owner | null | undefined, (owner: null) => void] {
  const [owner, setOwner] = useState<Owner | null | undefined>(undefined);
  useEffect(() => {
    let live = true;
    pending ??= api.me().then((res) => res.owner);
    pending
      .then((res) => live && setOwner(res))
      .catch(() => {
        pending = null;
        if (live) setOwner(null);
      });
    return () => {
      live = false;
    };
  }, []);
  return [owner, setOwner];
}

// A request refused because the sign-in expired: forget the cached owner so
// the page shows the sign-in card again.
export function handleSignedOut(err: unknown, setOwner: (owner: null) => void): boolean {
  if (!(err instanceof RequestError && err.code === "unauthorized")) return false;
  pending = null;
  setOwner(null);
  return true;
}

export const signInHref = (next: string) => `/auth/google?next=${encodeURIComponent(next)}`;

export async function signOut() {
  await api.logout().catch(() => undefined);
  pending = null;
  window.location.assign("/");
}

function GoogleG() {
  return (
    <svg width="18" height="18" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
      <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
      <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
      <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
    </svg>
  );
}

// The standard "Sign in with Google" look (white, thin grey border, the G),
// so people recognise it and know which account they are signing in with.
export function GoogleSignInButton({ next, className = "" }: { next: string; className?: string }) {
  return (
    <a
      href={signInHref(next)}
      className={`inline-flex min-h-11 items-center justify-center gap-2.5 rounded-full border border-[#747775] bg-white px-4 text-sm font-medium text-[#1f1f1f] no-underline hover:bg-[#f2f2f2] ${className}`}
    >
      <GoogleG />
      Sign in with Google
    </a>
  );
}

export function SignInCard({ next, title = "Sign in to create a link" }: { next: string; title?: string }) {
  return (
    <Card className="gap-3 p-5">
      <h1 className="font-display text-[22px] font-semibold leading-tight">{title}</h1>
      <p className="text-[15px] leading-normal text-muted">
        Your links and their documents stay in your account, on any device. The people you send links to never need an
        account.
      </p>
      <GoogleSignInButton next={next} className="self-start" />
    </Card>
  );
}
