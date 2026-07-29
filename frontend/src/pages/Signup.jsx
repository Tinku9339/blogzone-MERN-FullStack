import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { UserPlus } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = { name: '', email: '', password: '', confirmPassword: '' }

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (form.password.length < 6) {
      toast.error('Password should be at least 6 characters.')
      return
    }
    if (form.password !== form.confirmPassword) {
      toast.error('Passwords do not match.')
      return
    }

    setSubmitting(true)
    const result = await signup({ name: form.name, email: form.email, password: form.password })
    setSubmitting(false)

    if (result.ok) {
      toast.success('Account created — log in to continue.')
      navigate('/login', { replace: true })
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
      <p className="eyebrow mb-3">Join the desk</p>
      <h1 className="font-display text-3xl font-semibold text-paper">Create an account</h1>
      <p className="mt-2 text-sm text-muted">Draft, edit, and publish posts of your own.</p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            className="field-input"
            value={form.name}
            onChange={handleChange}
            placeholder="Your full name"
            required
            autoComplete="name"
          />
        </div>
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
            placeholder="At least 6 characters"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
          <input
            id="confirmPassword"
            name="confirmPassword"
            type="password"
            className="field-input"
            value={form.confirmPassword}
            onChange={handleChange}
            placeholder="Repeat your password"
            required
            minLength={6}
            autoComplete="new-password"
          />
        </div>
        <button type="submit" className="btn-primary mt-2 w-full" disabled={submitting}>
          {submitting ? 'Creating account…' : 'Create account'}
          <UserPlus className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Already have an account?{' '}
        <Link to="/login" className="text-brass hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
