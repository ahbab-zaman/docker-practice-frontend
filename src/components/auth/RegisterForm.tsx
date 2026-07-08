import { useState } from "react"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/constants/routes"
import { registerSchema } from "@/lib/validators"
import type { RegisterFormData } from "@/lib/validators"
import useAuth from "@/hooks/useAuth"
import Button from "@/components/ui/Button"
import Input from "@/components/ui/Input"
import Alert from "@/components/ui/Alert"

function RegisterForm() {
  const navigate = useNavigate()
  const { register } = useAuth()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [serverError, setServerError] = useState<string | null>(null)
  const [fieldErrors, setFieldErrors] = useState<Partial<Record<keyof RegisterFormData, string>>>({})

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setServerError(null)
    setFieldErrors({})

    const form = new FormData(e.currentTarget)
    const data: RegisterFormData = {
      name: form.get("name") as string,
      email: form.get("email") as string,
      password: form.get("password") as string,
      confirmPassword: form.get("confirmPassword") as string,
    }

    const result = registerSchema.safeParse(data)
    if (!result.success) {
      const errors: Partial<Record<keyof RegisterFormData, string>> = {}
      for (const issue of result.error.issues) {
        const field = issue.path[0] as keyof RegisterFormData
        if (!errors[field]) {
          errors[field] = issue.message
        }
      }
      setFieldErrors(errors)
      return
    }

    setIsSubmitting(true)
    try {
      await register({ name: result.data.name, email: result.data.email, password: result.data.password })
      navigate(ROUTES.HOME)
    } catch (err) {
      setServerError(err instanceof Error ? err.message : "Registration failed")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
      {serverError && <Alert variant="danger">{serverError}</Alert>}

      <Input
        label="Name"
        name="name"
        type="text"
        placeholder="John Doe"
        error={fieldErrors.name}
        autoComplete="name"
      />

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
        placeholder="At least 6 characters"
        error={fieldErrors.password}
        autoComplete="new-password"
      />

      <Input
        label="Confirm password"
        name="confirmPassword"
        type="password"
        placeholder="Repeat your password"
        error={fieldErrors.confirmPassword}
        autoComplete="new-password"
      />

      <Button type="submit" isLoading={isSubmitting} className="mt-2">
        Create account
      </Button>
    </form>
  )
}

export default RegisterForm
