import type { ButtonHTMLAttributes } from "react";

type Props = Omit<ButtonHTMLAttributes<HTMLButtonElement>, "type"> & { pressed: boolean };

export function Chip({ pressed, className = "", ...props }: Props) {
  return (
    <button
      type="button"
      aria-pressed={pressed}
      className={`min-h-11 cursor-pointer rounded-full border px-3.5 text-sm disabled:cursor-not-allowed disabled:opacity-50 ${
        pressed ? "border-ink bg-ink font-semibold text-white" : "border-input bg-surface font-medium text-ink"
      } ${className}`}
      {...props}
    />
  );
}
