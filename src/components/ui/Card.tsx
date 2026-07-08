import type { HTMLAttributes } from "react";

type Props = HTMLAttributes<HTMLDivElement> & {
  padding?: "sm" | "md" | "lg";
};

const paddingStyles: Record<NonNullable<Props["padding"]>, string> = {
  sm: "p-3",
  md: "p-5",
  lg: "p-8",
};

export default function Card({ padding = "md", className = "", ...rest }: Props) {
  return (
    <div
      className={`rounded-lg border border-border bg-surface shadow-sm ${paddingStyles[padding]} ${className}`}
      {...rest}
    />
  );
}
