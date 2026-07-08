import LoginForm from "@/components/auth/LoginForm"

function LoginPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Sign in</h1>
      <p className="mt-2 mb-8 text-muted">Welcome back! Enter your credentials.</p>
      <LoginForm />
    </div>
  )
}

export default LoginPage
