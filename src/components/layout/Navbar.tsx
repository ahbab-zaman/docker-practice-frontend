import { useState } from "react"
import { NavLink, useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import useAuth from "@/hooks/useAuth"
import Button from "@/components/ui/Button"

const linkClass = ({ isActive }: { isActive: boolean }) =>
  `text-sm font-medium transition-colors ${
    isActive ? "text-primary" : "text-muted hover:text-foreground"
  }`

function Navbar() {
  const { isAuthenticated, user, isLoading, logout } = useAuth()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  async function handleLogout() {
    await logout()
    navigate(ROUTES.HOME)
    setMobileOpen(false)
  }

  const authLinks = isLoading ? (
    <div className="flex items-center gap-2">
      <span className="h-4 w-20 animate-pulse rounded bg-muted/30" />
      <span className="h-8 w-16 animate-pulse rounded-lg bg-muted/30" />
    </div>
  ) : isAuthenticated ? (
    <>
      <span className="text-sm text-muted">{user?.name}</span>
      <Button variant="secondary" size="sm" onClick={handleLogout}>
        Logout
      </Button>
    </>
  ) : (
    <>
      <NavLink to={ROUTES.LOGIN} className={linkClass} onClick={() => setMobileOpen(false)}>
        Login
      </NavLink>
      <NavLink to={ROUTES.REGISTER} className={linkClass} onClick={() => setMobileOpen(false)}>
        Register
      </NavLink>
    </>
  )

  return (
    <nav className="border-b border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <NavLink to={ROUTES.HOME} className="text-lg font-bold text-foreground">
          DockerBase
        </NavLink>

        <button
          className="flex md:hidden rounded-lg p-2 text-muted hover:text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50"
          onClick={() => setMobileOpen(!mobileOpen)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
        >
          {mobileOpen ? (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          )}
        </button>

        <div className="hidden md:flex items-center gap-6">
          <NavLink to={ROUTES.HOME} className={linkClass} end>
            Home
          </NavLink>
          {authLinks}
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-border px-4 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            <NavLink
              to={ROUTES.HOME}
              className={linkClass}
              end
              onClick={() => setMobileOpen(false)}
            >
              Home
            </NavLink>
            {/* auth links for mobile rendered inline below */}
            {isLoading ? (
              <div className="flex items-center gap-2">
                <span className="h-4 w-20 animate-pulse rounded bg-muted/30" />
                <span className="h-8 w-16 animate-pulse rounded-lg bg-muted/30" />
              </div>
            ) : isAuthenticated ? (
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted">{user?.name}</span>
                <Button variant="secondary" size="sm" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            ) : (
              <>
                <NavLink
                  to={ROUTES.LOGIN}
                  className={linkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Login
                </NavLink>
                <NavLink
                  to={ROUTES.REGISTER}
                  className={linkClass}
                  onClick={() => setMobileOpen(false)}
                >
                  Register
                </NavLink>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
