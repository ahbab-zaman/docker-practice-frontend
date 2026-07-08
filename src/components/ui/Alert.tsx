import type { ReactNode } from "react"

type AlertVariant = "success" | "danger" | "info"

type Props = {
  variant?: AlertVariant
  children: ReactNode
  className?: string
}

const variantClasses: Record<AlertVariant, string> = {
  success: "bg-success/10 text-success border-success/30",
  danger: "bg-danger/10 text-danger border-danger/30",
  info: "bg-primary/10 text-primary border-primary/30",
}

function Alert({ variant = "info", children, className = "" }: Props) {
  return (
    <div
      className={`rounded-lg border px-4 py-3 text-sm font-medium ${variantClasses[variant]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  )
}

export default Alert
