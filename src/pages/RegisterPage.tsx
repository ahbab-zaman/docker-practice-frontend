import RegisterForm from "@/components/auth/RegisterForm"

function RegisterPage() {
  return (
    <div className="mx-auto max-w-md px-4 py-12 sm:px-6">
      <h1 className="text-2xl font-bold text-foreground">Create an account</h1>
      <p className="mt-2 mb-8 text-muted">Fill in the form to register.</p>
      <RegisterForm />
    </div>
  )
}

export default RegisterPage
