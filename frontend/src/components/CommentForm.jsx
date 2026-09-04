import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Send, LogIn, UserPlus, MessageSquare } from 'lucide-react'
import { postComment } from '../api/comments.js'
import { getErrorMessage } from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { initials } from '../utils/constants.js'

export default function CommentForm({ blogId, onSubmitted }) {
  const { user, isAuthenticated } = useAuth()
  const location = useLocation()
  const [content, setContent] = useState('')
  const [submitting, setSubmitting] = useState(false)

  // If user is not logged in, prompt to log in or create an account
  if (!isAuthenticated) {
    return (
      <div className="rounded-sm border border-paper-line/15 bg-canvas-panel p-6 text-center">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-paper-line/15 text-brass">
          <MessageSquare className="h-5 w-5" />
        </div>
        <h3 className="mt-3 font-display text-lg font-semibold text-paper">
          Join the conversation
        </h3>
        <p className="mx-auto mt-1.5 max-w-sm text-sm text-muted">
          Sign in or create an account to leave a comment on this post.
        </p>
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            state={{ from: location.pathname }}
            className="btn-primary"
          >
            <LogIn className="h-4 w-4" /> Log in
          </Link>
          <Link
            to="/signup"
            state={{ from: location.pathname }}
            className="btn-outline"
          >
            <UserPlus className="h-4 w-4" /> Sign up
          </Link>
        </div>
      </div>
    )
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!content.trim()) {
      toast.error('Please write a comment before posting.')
      return
    }
    setSubmitting(true)
    try {
      const res = await postComment(blogId, {
        name: user?.name || 'Anonymous Reader',
        email: user?.email || '',
        content: content.trim(),
      })
      toast.success('Comment posted!')
      setContent('')
      onSubmitted?.(res.data?.data)
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not post your comment.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-paper-line/15 bg-canvas-panel p-5">
      <div className="mb-4 flex items-center justify-between border-b border-paper-line/10 pb-3">
        <p className="eyebrow mb-0">Leave a reply</p>
        <div className="flex items-center gap-2">
          {user?.profileImage ? (
            <img
              src={user.profileImage}
              alt={user.name}
              className="h-6 w-6 rounded-full object-cover border border-paper-line/30"
            />
          ) : (
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-canvas-raised font-mono text-[10px] text-brass">
              {initials(user?.name) || 'U'}
            </div>
          )}
          <span className="text-xs text-muted">
            Posting as <span className="font-medium text-paper">{user?.name}</span>
          </span>
        </div>
      </div>

      <div>
        <label className="sr-only" htmlFor="content">Your comment</label>
        <textarea
          id="content"
          name="content"
          className="field-input min-h-[110px] resize-y"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts on this post…"
          maxLength={2000}
          required
        />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="font-mono text-[11px] text-muted">
          Comments are reviewed before they appear publicly.
        </p>
        <button type="submit" className="btn-primary" disabled={submitting}>
          {submitting ? 'Posting…' : 'Post comment'}
          <Send className="h-3.5 w-3.5" />
        </button>
      </div>
    </form>
  )
}
