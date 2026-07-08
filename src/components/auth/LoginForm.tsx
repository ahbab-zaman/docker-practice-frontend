import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { loginSchema } from "@/lib/validators"
import type { LoginFormData } from "@/lib/validators"
import useAuth from "@/hooks/useAuth"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Alert from "@/components/ui/Alert"

function LoginForm() {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof LoginFormData, string>>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const data: LoginFormData = {
      email: form.get("email") as string,
      password: form.get("password") as string,
    }

    const result = loginSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<Record<keyof LoginFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof LoginFormData
        if (!errors[field]) {
          errors[field] = issue.message
        }
      }
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      await login(result.data)
      navigate(ROUTES.HOME)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Login failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Input
        label="Email"
        name="email"
        type="email"
        placeholder="john@example.com"
        error={fieldErrors.email}
        autoComplete="email"
      />

      <Input
        label="Password"
        name="password"
        type="password"
        placeholder="Enter your password"
        error={fieldErrors.password}
        autoComplete="current-password"
      />

      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Sign in
      </Button>
    </form>
  )
}

export default LoginForm
