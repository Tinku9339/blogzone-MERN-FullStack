import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { Save, KeyRound, X, Eye, EyeOff } from 'lucide-react'
import { useAuth } from '../context/AuthContext.jsx'
import { updateProfile, changePassword } from '../api/profile.js'
import { uploadImage } from '../api/misc.js'
import { getErrorMessage } from '../api/axios.js'
import { CATEGORIES, initials } from '../utils/constants.js'
import Loader from '../components/Loader.jsx'

export default function Profile() {
  const { user, refreshUser, loading: authLoading } = useAuth()
  const [form, setForm] = useState({ name: '', bio: '', description: '', profileImage: '', writingCategory: [] })
  const [saving, setSaving] = useState(false)
  const [uploadingAvatar, setUploadingAvatar] = useState(false)

  const [passwordForm, setPasswordForm] = useState({ oldPassword: '', newPassword: '', confirmNew: '' })
  const [changingPassword, setChangingPassword] = useState(false)
  const [showOldPassword, setShowOldPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmNew, setShowConfirmNew] = useState(false)

  useEffect(() => {
    if (!user) return
    setForm({
      name: user.name || '',
      bio: user.bio || '',
      description: user.description || '',
      profileImage: user.profileImage || '',
      writingCategory: user.writingCategory || [],
    })
  }, [user])

  if (authLoading || !user) return <Loader label="Loading your profile" full />

  const handleChange = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }))

  const toggleCategory = (cat) => {
    setForm((f) => ({
      ...f,
      writingCategory: f.writingCategory.includes(cat)
        ? f.writingCategory.filter((c) => c !== cat)
        : [...f.writingCategory, cat],
    }))
  }

  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0]
    if (!file) return
    if (!file.type.startsWith('image/')) {
      toast.error('Please choose an image file.')
      return
    }
    setUploadingAvatar(true)
    try {
      const res = await uploadImage(file)
      setForm((f) => ({ ...f, profileImage: res.data.url }))
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not upload image.'))
    } finally {
      setUploadingAvatar(false)
      e.target.value = ''
    }
  }

  const handleSaveProfile = async (e) => {
    e.preventDefault()
    setSaving(true)
    try {
      await updateProfile(form)
      await refreshUser()
      toast.success('Profile updated')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update your profile.'))
    } finally {
      setSaving(false)
    }
  }

  const handleChangePassword = async (e) => {
    e.preventDefault()
    if (passwordForm.newPassword.length < 6) {
      toast.error('New password should be at least 6 characters.')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmNew) {
      toast.error('New passwords do not match.')
      return
    }
    setChangingPassword(true)
    try {
      await changePassword({
        oldPassword: passwordForm.oldPassword,
        newPassword: passwordForm.newPassword,
      })
      toast.success('Password changed')
      setPasswordForm({ oldPassword: '', newPassword: '', confirmNew: '' })
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not change your password.'))
    } finally {
      setChangingPassword(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl">
      <p className="eyebrow mb-2">Your desk</p>
      <h1 className="font-display text-3xl font-semibold text-paper">Profile</h1>

      <form onSubmit={handleSaveProfile} className="mt-8 flex flex-col gap-6">
        <div className="flex items-center gap-5">
          <div className="relative h-20 w-20 flex-shrink-0">
            {form.profileImage ? (
              <img
                src={form.profileImage}
                alt={form.name}
                className="h-20 w-20 rounded-full object-cover"
              />
            ) : (
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-canvas-panel font-display text-xl text-brass">
                {initials(form.name)}
              </div>
            )}
            {uploadingAvatar && (
              <div className="absolute inset-0 flex items-center justify-center rounded-full bg-canvas/70">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-paper-line/30 border-t-brass" />
              </div>
            )}
          </div>
          <div>
            <label className="btn-outline cursor-pointer">
              Change photo
              <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
            </label>
            <p className="mt-2 font-mono text-[11px] text-muted">JPG or PNG, up to 5MB</p>
          </div>
        </div>

        <div>
          <label className="field-label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            className="field-input"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input id="email" className="field-input opacity-60" value={user.email} disabled />
          <p className="mt-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-muted">
            Email can&apos;t be changed
          </p>
        </div>

        <div>
          <label className="field-label" htmlFor="bio">Short bio</label>
          <input
            id="bio"
            name="bio"
            className="field-input"
            value={form.bio}
            onChange={handleChange}
            placeholder="One line about you"
            maxLength={160}
          />
        </div>

        <div>
          <label className="field-label" htmlFor="description">About</label>
          <textarea
            id="description"
            name="description"
            className="field-input min-h-[120px] resize-y"
            value={form.description}
            onChange={handleChange}
            placeholder="A longer description for your author page"
          />
        </div>

        <div>
          <label className="field-label">Writing categories</label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => toggleCategory(cat)}
                className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
                  form.writingCategory.includes(cat)
                    ? 'border-brass bg-brass text-canvas'
                    : 'border-paper-line/25 text-muted hover:border-brass hover:text-brass'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-end border-t border-paper-line/10 pt-6">
          <button type="submit" className="btn-primary" disabled={saving}>
            {saving ? 'Saving…' : 'Save profile'}
            <Save className="h-4 w-4" />
          </button>
        </div>
      </form>

      <div className="mt-12 border-t border-paper-line/10 pt-8">
        <h2 className="font-display text-xl text-paper">Change password</h2>
        <form onSubmit={handleChangePassword} className="mt-5 flex flex-col gap-4">
          <div>
            <label className="field-label" htmlFor="oldPassword">Current password</label>
            <div className="relative">
              <input
                id="oldPassword"
                type={showOldPassword ? 'text' : 'password'}
                className="field-input pr-10"
                value={passwordForm.oldPassword}
                onChange={(e) => setPasswordForm((f) => ({ ...f, oldPassword: e.target.value }))}
                autoComplete="current-password"
                required
              />
              <button
                type="button"
                onClick={() => setShowOldPassword((prev) => !prev)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-paper transition-colors focus:outline-none"
                title={showOldPassword ? 'Hide password' : 'Show password'}
                tabIndex={-1}
              >
                {showOldPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="field-label" htmlFor="newPassword">New password</label>
              <div className="relative">
                <input
                  id="newPassword"
                  type={showNewPassword ? 'text' : 'password'}
                  className="field-input pr-10"
                  value={passwordForm.newPassword}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                  autoComplete="new-password"
                  minLength={6}
                  required
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
              <label className="field-label" htmlFor="confirmNew">Confirm new password</label>
              <div className="relative">
                <input
                  id="confirmNew"
                  type={showConfirmNew ? 'text' : 'password'}
                  className="field-input pr-10"
                  value={passwordForm.confirmNew}
                  onChange={(e) => setPasswordForm((f) => ({ ...f, confirmNew: e.target.value }))}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmNew((prev) => !prev)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-paper transition-colors focus:outline-none"
                  title={showConfirmNew ? 'Hide password' : 'Show password'}
                  tabIndex={-1}
                >
                  {showConfirmNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>
          </div>
          <div className="flex justify-end gap-3 pt-2">
            {(passwordForm.oldPassword || passwordForm.newPassword || passwordForm.confirmNew) && (
              <button
                type="button"
                className="btn-ghost"
                onClick={() => setPasswordForm({ oldPassword: '', newPassword: '', confirmNew: '' })}
              >
                <X className="h-3.5 w-3.5" /> Clear
              </button>
            )}
            <button type="submit" className="btn-outline" disabled={changingPassword}>
              {changingPassword ? 'Updating…' : 'Update password'}
              <KeyRound className="h-3.5 w-3.5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
