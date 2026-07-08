import { createContext, useCallback, useEffect, useMemo, useState } from "react"
import type { ReactNode } from "react"
import { getMe, login as loginService, logout as logoutService, register as registerService } from "@/services/auth.service"
import type { User } from "@/types/auth.types"
import type { LoginPayload, RegisterPayload } from "@/types/auth.types"

type AuthContextValue = {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextValue | null>(null)

type Props = { children: ReactNode }

function AuthProvider({ children }: Props) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    getMe()
      .then((res) => {
        if (res.success) {
          setUser(res.data)
        }
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [])

  const login = useCallback(async (payload: LoginPayload) => {
    const res = await loginService(payload)
    if (!res.success) {
      throw new Error(res.message)
    }
    setUser(res.data)
  }, [])

  const register = useCallback(async (payload: RegisterPayload) => {
    const res = await registerService(payload)
    if (!res.success) {
      throw new Error(res.message)
    }
    setUser(res.data)
  }, [])

  const logout = useCallback(async () => {
    await logoutService()
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isLoading,
      isAuthenticated: user !== null,
      login,
      register,
      logout,
    }),
    [user, isLoading, login, register, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export default AuthProvider
