import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import { KeyRound, ArrowLeft, CheckCircle2, Eye, EyeOff } from 'lucide-react'
import { resetPasswordRequest } from '../api/auth.js'
import { getErrorMessage } from '../api/axios.js'

export default function ForgotPassword() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    email: '',
    recoveryKey: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [submitting, setSubmitting] = useState(false)
  const [success, setSuccess] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const handleChange = (e) =>
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!form.email.trim()) {
      toast.error('Please enter your email address.')
      return
    }
    if (!form.recoveryKey.trim()) {
      toast.error('Please enter your unique recovery key.')
      return
    }
    if (form.newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.')
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      toast.error('New passwords do not match.')
      return
    }

    setSubmitting(true)
    try {
      const res = await resetPasswordRequest({
        email: form.email.trim(),
        recoveryKey: form.recoveryKey.trim(),
        newPassword: form.newPassword,
      })

      setSuccess(true)
      toast.success(res.data.message || 'Password reset successfully!')
      setTimeout(() => {
        navigate('/login', { replace: true })
      }, 2500)
    } catch (err) {
      toast.error(getErrorMessage(err, 'Failed to reset password. Please check your credentials.'))
    } finally {
      setSubmitting(false)
    }
  }

  if (success) {
    return (
      <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
        <div className="rounded-sm border border-paper-line/20 bg-canvas-panel p-6 sm:p-8 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-sage/15 text-sage border border-sage/30 mb-4">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h2 className="font-display text-2xl font-bold text-paper">Password Reset Complete</h2>
          <p className="mt-2 text-sm text-muted">
            Your password has been successfully updated. Redirecting you to the login screen…
          </p>
          <Link
            to="/login"
            className="btn-primary mt-6 inline-flex w-full items-center justify-center gap-2"
          >
            <span>Go to Login</span>
            <span aria-hidden="true">&rarr;</span>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="mx-auto flex min-h-[80vh] max-w-md flex-col justify-center px-5 py-16 sm:px-8">
      <Link
        to="/login"
        className="eyebrow mb-6 inline-flex items-center gap-1.5 hover:text-paper"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back to login
      </Link>

      <p className="eyebrow mb-3">Account Recovery</p>
      <h1 className="font-display text-3xl font-semibold text-paper">Reset password</h1>
      <p className="mt-2 text-sm text-muted">
        Enter your registered email and the unique recovery key assigned to you during signup.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-4">
        <div>
          <label className="field-label" htmlFor="email">Registered Email</label>
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
          <label className="field-label" htmlFor="recoveryKey">Unique Recovery Key</label>
          <input
            id="recoveryKey"
            name="recoveryKey"
            type="text"
            className="field-input font-mono tracking-wider"
            value={form.recoveryKey}
            onChange={handleChange}
            placeholder="e.g. BZ-XXXX-XXXX-XXXX"
            required
            autoComplete="off"
            spellCheck="false"
          />
          <p className="mt-1 font-mono text-[11px] text-muted">
            The unique key shown to you when you created your account.
          </p>
        </div>

        <div>
          <label className="field-label" htmlFor="newPassword">New Password</label>
          <div className="relative">
            <input
              id="newPassword"
              name="newPassword"
              type={showNewPassword ? 'text' : 'password'}
              className="field-input pr-10"
              value={form.newPassword}
              onChange={handleChange}
              placeholder="At least 6 characters"
              required
              minLength={6}
              autoComplete="new-password"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword((prev) => !prev)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-paper transition-colors focus:outline-none"
              title={showNewPassword ? 'Hide password' : 'Show password'}
              tabIndex={-1}
            >
              {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="confirmPassword">Confirm New Password</label>
          <div className="relative">
            <input
              id="confirmPassword"
              name="confirmPassword"
              type={showConfirmPassword ? 'text' : 'password'}
              className="field-input pr-10"
              value={form.confirmPassword}
              onChange={handleChange}
              placeholder="Repeat your new password"
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
          {submitting ? 'Resetting password…' : 'Reset Password'}
          <KeyRound className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-muted">
        Remember your password?{' '}
        <Link to="/login" className="text-brass hover:underline">
          Log in
        </Link>
      </p>
    </div>
  )
}
