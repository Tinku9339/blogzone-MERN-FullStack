import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { UserPlus, Key, Copy, Check, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'

const initialForm = { name: '', email: '', password: '', confirmPassword: '' }

export default function Signup() {
  const { signup } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)
  const [registeredKey, setRegisteredKey] = useState(null)
  const [copiedKey, setCopiedKey] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleCopyKey = () => {
    if (!registeredKey) return
    navigator.clipboard.writeText(registeredKey).then(() => {
      setCopiedKey(true)
      toast.success('Recovery key copied to clipboard!')
      setTimeout(() => setCopiedKey(false), 2500)
    })
  }

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
      if (result.recoveryKey) {
        setRegisteredKey(result.recoveryKey)
        toast.success('Account created! Please save your unique recovery key.')
      } else {
        toast.success('Account created! Welcome to BlogZone.')
        navigate('/dashboard', { replace: true })
      }
    } else {
      toast.error(result.message)
    }
  }

  if (registeredKey) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
        <div className="rounded-sm border border-paper-line/20 bg-canvas-panel p-6 sm:p-8 shadow-sm">
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brass/15 text-brass border border-brass/30 mb-4">
            <Key className="h-6 w-6" />
          </div>

          <p className="eyebrow mb-1 text-[11px] text-brass">Account Created</p>
          <h2 className="font-display text-2xl font-bold text-paper">Your Recovery Key</h2>

          {/* Requested disclaimer */}
          <div className="mt-4 rounded-sm border border-amber-500/30 bg-amber-500/10 p-3.5 text-amber-300">
            <p className="font-mono text-xs font-semibold leading-relaxed">
              ⚠️ please save this key for forget your password in future.
            </p>
          </div>

          {/* Key Display & 1-Click Copy */}
          <div className="mt-4 flex items-center justify-between gap-3 rounded-sm border border-paper-line/30 bg-canvas px-4 py-3">
            <code className="font-mono text-base font-bold tracking-widest text-brass select-all">
              {registeredKey}
            </code>
            <button
              type="button"
              onClick={handleCopyKey}
              className="btn-outline inline-flex items-center gap-1.5 px-3 py-1.5 text-xs text-paper hover:text-brass"
              title="Copy recovery key"
            >
              {copiedKey ? (
                <>
                  <Check className="h-3.5 w-3.5 text-sage" />
                  <span className="text-sage font-medium">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Key</span>
                </>
              )}
            </button>
          </div>

          <p className="mt-3 text-xs text-muted leading-relaxed">
            Store this key somewhere safe (such as a password manager or private note). If you ever forget your password, you will need this key alongside your email to regain access.
          </p>

          <button
            type="button"
            onClick={() => navigate('/dashboard', { replace: true })}
            className="btn-primary mt-6 w-full inline-flex items-center justify-center gap-2"
          >
            <span>Continue to Dashboard</span>
            <span aria-hidden="true">&rarr;</span>
          </button>
        </div>
      </div>
    )
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
          <div className="relative">
            <input
              id="password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              className="field-input pr-10"
              value={form.password}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-paper transition-colors focus:outline-none"
              title={showPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>
        <div>
          <label className="field-label" htmlFor="confirmPassword">Confirm password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="field-input pr-10"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your password"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-paper transition-colors focus:outline-none"
              title={showConfirmPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
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
