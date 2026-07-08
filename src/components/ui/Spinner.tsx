type Props = {
  size?: "sm" | "md" | "lg";
  className?: string;
};

const sizeStyles: Record<NonNullable<Props["size"]>, string> = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-[3px]",
  lg: "h-12 w-12 border-4",
};

export default function Spinner({ size = "md", className = "" }: Props) {
  return (
    <div
      className={`animate-spin rounded-full border-border border-t-primary ${sizeStyles[size]} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
}
