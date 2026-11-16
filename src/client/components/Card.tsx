import type { HTMLAttributes, ReactNode } from "react";

export function Card({ className = "", ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={`flex flex-col gap-2.5 rounded-card border border-border bg-surface p-4 ${className}`} {...props} />;
}

export function CardLabel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <p className={`text-xs font-semibold text-muted ${className}`}>{children}</p>;
}
