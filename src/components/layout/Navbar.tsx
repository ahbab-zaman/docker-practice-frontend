import { NavLink } from "react-router-dom"
import { ROUTES } from "@/constants/routes"

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-primary" : "text-muted hover:text-foreground"
  }`

function Navbar() {
  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to={ROUTES.HOME} className="text-lg font-bold text-foreground">
          E-Commerce
        </NavLink>
        <div className="flex items-center gap-6">
          <NavLink to={ROUTES.HOME} className={linkClass} end>
            Home
          </NavLink>
          <NavLink to={ROUTES.LOGIN} className={linkClass}>
            Login
          </NavLink>
          <NavLink to={ROUTES.REGISTER} className={linkClass}>
            Register
          </NavLink>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
