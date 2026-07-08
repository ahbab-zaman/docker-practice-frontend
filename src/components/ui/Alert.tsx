import type { ReactNode } from "react";

type Props = {
  variant?: "success" | "danger";
  children: ReactNode;
  className?: string;
};

const variantStyles: Record<NonNullable<Props["variant"]>, string> = {
  success: "border-success/30 bg-success/10 text-success",
  danger: "border-danger/30 bg-danger/10 text-danger",
};

export default function Alert({ variant = "danger", children, className = "" }: Props) {
  return (
    <div
      className={`rounded-md border px-4 py-3 text-sm ${variantStyles[variant]} ${className}`}
      role="alert"
    >
      {children}
    </div>
  );
}
