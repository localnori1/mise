import { useEffect, useState } from "react";
import type { Me } from "../shared/api";
import { api, RequestError } from "./api";
import { buttonClass } from "./components/Button";
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

export function SignInCard({ next, title = "Sign in to create a link" }: { next: string; title?: string }) {
  return (
    <Card className="gap-3 p-5">
      <h1 className="font-display text-[22px] font-semibold leading-tight">{title}</h1>
      <p className="text-[15px] leading-normal text-muted">
        Your links and their documents stay in your account, on any device. The people you send links to never need an
        account.
      </p>
      <a href={signInHref(next)} className={buttonClass("primary", "self-start")}>
        Continue with Google
      </a>
    </Card>
  );
}
