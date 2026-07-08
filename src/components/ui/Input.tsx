import type { InputHTMLAttributes } from "react";

type Props = InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
};

export default function Input({ label, error, className = "", id, ...rest }: Props) {
  const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-");

  return (
    <div className="flex flex-col gap-1">
      {label && (
        <label htmlFor={inputId} className="text-sm font-medium text-foreground">
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={`rounded-md border bg-surface px-3 py-2 text-sm text-foreground placeholder-muted transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary ${error ? "border-danger" : "border-border"} ${className}`}
        {...rest}
      />
      {error && <span className="text-xs text-danger">{error}</span>}
    </div>
  );
}
