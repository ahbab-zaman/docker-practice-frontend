import { forwardRef } from "react"
import type { InputHTMLAttributes } from "react"

type Props = {
  label?: string
  error?: string
} & InputHTMLAttributes<HTMLInputElement>

const Input = forwardRef<HTMLInputElement, Props>(
  ({ label, error, className = "", id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, "-")

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-foreground"
          >
            {label}
          </label>
        )}
        <input
          ref={ref}
          id={inputId}
          className={`rounded-lg border bg-surface px-3 py-2 text-sm text-foreground placeholder:text-muted transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50 ${
            error
              ? "border-danger focus:ring-danger/50"
              : "border-border"
          } ${className}`}
          {...rest}
        />
        {error && (
          <span className="text-xs text-danger">{error}</span>
        )}
      </div>
    )
  },
)

Input.displayName = "Input"

export default Input
