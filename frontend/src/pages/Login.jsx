import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { LogIn } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

export default function Login() {
  const { login } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [form, setForm] = useState({ email: '', password: '' })
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    const result = await login(form)
    setSubmitting(false)
    if (result.ok) {
      toast.success('Welcome back.')
      const redirectTo = location.state?.from
      navigate(redirectTo && redirectTo !== '/login' ? redirectTo : '/dashboard', { replace: true })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
      <p className="eyebrow mb-3">Welcome back</p>
      <h1 className="font-display text-3xl font-semibold text-paper">Log in to the desk</h1>
      <p className="mt-2 text-sm text-muted">Pick up where you left off.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            name="email"
            type="email"
            className="field-input"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            required
            autoComplete="email"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            className="field-input"
            value={form.password}
            onChange={handleChange}
            placeholder="••••••••"
            required
            autoComplete="current-password"
          />
        </div>
        <button type="submit" className="btn-primary mt-2 w-full" disabled={submitting}>
          {submitting ? 'Logging in…' : 'Log in'}
          <LogIn className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        New here?{' '}
        <Link to="/signup" className="text-brass hover:underline">
          Create an account
        </Link>
      </p>
    </div>
  )
}
