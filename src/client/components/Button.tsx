import { LoaderCircle } from "lucide-react";
import type { ButtonHTMLAttributes } from "react";

export type Variant = "primary" | "secondary" | "danger";
export type Size = "md" | "sm";

const variants: Record<Variant, string> = {
  primary: "bg-ink text-white",
  secondary: "border border-input bg-surface text-ink",
  danger: "bg-danger text-white",
};

const sizes: Record<Size, string> = {
  md: "min-h-12 px-4 text-[15px]",
  sm: "min-h-11 px-3.5 text-sm",
};

export function buttonClass(variant: Variant = "primary", extra = "", size: Size = "md") {
  return `inline-flex cursor-pointer items-center justify-center gap-2 rounded-btn font-semibold no-underline disabled:cursor-not-allowed disabled:opacity-50 ${variants[variant]} ${sizes[size]} ${extra}`;
}

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { variant?: Variant; size?: Size; loading?: boolean };

export function Button({ variant = "primary", size = "md", loading = false, className = "", disabled, children, ...props }: Props) {
  return (
    <button
      type="button"
      className={buttonClass(variant, className, size)}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      {...props}
    >
      {loading && <LoaderCircle size={18} className="animate-spin" aria-hidden="true" />}
      {children}
    </button>
  );
}
