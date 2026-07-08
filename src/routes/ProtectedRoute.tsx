import { Navigate, Outlet, useLocation } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import useAuth from "@/hooks/useAuth"
import Spinner from "@/components/ui/Spinner"

function ProtectedRoute() {
  const { isAuthenticated, isLoading } = useAuth()
  const location = useLocation()

  if (isLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center">
        <Spinner size="lg" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} state={{ from: location }} replace />
  }

  return <Outlet />
}

export default ProtectedRoute
