import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'

export default function NotFound() {
  return (
    <div className="mx-auto flex min-h-[70vh] max-w-md flex-col items-center justify-center px-5 text-center">
      <Compass className="h-8 w-8 text-muted" strokeWidth={1.5} />
      <p className="eyebrow mt-4">404</p>
      <h1 className="mt-2 font-display text-3xl font-semibold text-paper">Page not found</h1>
      <p className="mt-2 text-sm text-muted">
        Whatever you were looking for isn&apos;t on this desk.
      </p>
      <Link to="/" className="btn-primary mt-6">
        Back to home
      </Link>
    </div>
  )
}
