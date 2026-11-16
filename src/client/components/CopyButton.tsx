import { Check, Copy } from "lucide-react";
import { useState } from "react";
import { Button, type Size, type Variant } from "./Button";

type State = "idle" | "copied" | "failed";

export function CopyButton({
  text,
  label = "Copy link",
  variant = "secondary",
  size = "md",
  className = "",
}: {
  text: string;
  label?: string;
  variant?: Variant;
  size?: Size;
  className?: string;
}) {
  const [state, setState] = useState<State>("idle");

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setState("copied");
    } catch {
      setState("failed");
    }
    window.setTimeout(() => setState("idle"), 2500);
  };

  return (
    <Button variant={variant} size={size} onClick={copy} className={className}>
      {state === "copied" ? <Check size={18} aria-hidden="true" /> : <Copy size={18} aria-hidden="true" />}
      <span aria-live="polite">
        {state === "copied" ? "Copied" : state === "failed" ? "Couldn't copy. Select and copy it instead." : label}
      </span>
    </Button>
  );
}
