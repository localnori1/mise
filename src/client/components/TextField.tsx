import { useId, type ReactNode } from "react";

type Props = {
  label: ReactNode;
  value: string;
  onChange: (value: string) => void;
  hint?: ReactNode;
  rows?: number;
  required?: boolean;
  disabled?: boolean;
  placeholder?: string;
  labelClassName?: string;
};

const field =
  "w-full rounded-btn border border-input bg-surface px-3 text-[15px] text-ink placeholder:text-muted disabled:opacity-60";

export function TextField({ label, value, onChange, hint, rows, required, disabled, placeholder, labelClassName }: Props) {
  const id = useId();
  const hintId = hint ? `${id}-hint` : undefined;
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={id} className={labelClassName ?? "text-[13px] text-muted"}>
        {label}
      </label>
      {rows ? (
        <textarea
          id={id}
          rows={rows}
          value={value}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
          className={`${field} resize-y py-2.5 leading-normal`}
        />
      ) : (
        <input
          id={id}
          type="text"
          value={value}
          required={required}
          disabled={disabled}
          placeholder={placeholder}
          aria-describedby={hintId}
          onChange={(e) => onChange(e.target.value)}
          className={`${field} min-h-11`}
        />
      )}
      {hint && (
        <p id={hintId} className="text-[13px] text-muted">
          {hint}
        </p>
      )}
    </div>
  );
}
