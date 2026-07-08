import type { ButtonHTMLAttributes } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger";
};

const variantStyles: Record<NonNullable<Props["variant"]>, string> = {
  primary: "bg-primary text-primary-foreground hover:brightness-110",
  secondary: "bg-surface text-foreground border border-border hover:bg-muted/10",
  danger: "bg-danger text-primary-foreground hover:brightness-110",
};

export default function Button({ variant = "primary", className = "", disabled, ...rest }: Props) {
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary disabled:pointer-events-none disabled:opacity-50 ${variantStyles[variant]} ${className}`}
      disabled={disabled}
      {...rest}
    />
  );
}
