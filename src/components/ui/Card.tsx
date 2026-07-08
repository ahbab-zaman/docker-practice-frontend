import type { ReactNode, HTMLAttributes } from "react"

type Props = {
  children: ReactNode
} & HTMLAttributes<HTMLDivElement>

function Card({ children, className = "", ...rest }: Props) {
  return (
    <div
      className={`rounded-xl border border-border bg-surface p-6 shadow-sm ${className}`}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Card
