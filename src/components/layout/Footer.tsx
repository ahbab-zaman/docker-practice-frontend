function Footer() {
  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-center px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-muted">
          &copy; {new Date().getFullYear()} E-Commerce. All rights reserved.
        </p>
      </div>
    </footer>
  )
}

export default Footer
