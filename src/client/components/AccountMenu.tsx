import { ChevronDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { signOut, useOwner } from "../auth";
import { Link } from "../router";

// The signed-in owner's menu: who they are, a way to their links, and Sign
// out. Shows nothing when nobody is signed in.
export function AccountMenu() {
  const [owner] = useOwner();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  if (!owner) return null;
  const label = owner.name ?? owner.email ?? "Account";
  const initial = label.trim().charAt(0).toUpperCase() || "?";
  const item = "flex min-h-11 w-full items-center rounded-lg px-3 text-left text-sm font-medium text-ink no-underline hover:bg-bg";

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        aria-label={`Account menu for ${label}`}
        onClick={() => setOpen((o) => !o)}
        className="flex min-h-11 cursor-pointer items-center gap-2 rounded-full border border-border bg-white py-1 pl-1 pr-3 text-sm font-semibold text-ink"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-navy text-sm font-semibold text-white">
          {initial}
        </span>
        <span className="hidden max-w-[140px] truncate sm:inline">{label}</span>
        <ChevronDown size={16} aria-hidden="true" />
      </button>
      {open && (
        <div className="absolute right-0 top-full z-20 mt-2 w-64 rounded-xl border border-border bg-white p-1.5 shadow-[0_8px_24px_rgba(20,23,28,0.12)]">
          <div className="px-3 py-2">
            <p className="m-0 truncate text-sm font-semibold">{owner.name ?? "Signed in"}</p>
            {owner.email && <p className="m-0 truncate text-[13px] text-muted">{owner.email}</p>}
          </div>
          <Link href="/links" onClick={() => setOpen(false)} className={item}>
            Your links
          </Link>
          <button type="button" onClick={signOut} className={`${item} cursor-pointer border-0 bg-transparent`}>
            Sign out
          </button>
        </div>
      )}
    </div>
  );
}
