import { useState } from 'react'
import toast from 'react-hot-toast'
import { Send } from 'lucide-react'
import { postComment } from '../api/comments.js'
import { getErrorMessage } from '../api/axios.js'

const initialForm = { name: '', email: '', content: '' }

export default function CommentForm({ blogId, onSubmitted }) {
  const [form, setForm] = useState(initialForm)
  const [submitting, setSubmitting] = useState(false)

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.name.trim() || !form.content.trim()) {
      toast.error('Name and comment are required.')
      return
    }
    setSubmitting(true)
    try {
      await postComment(blogId, form)
      toast.success('Thanks — your comment is awaiting review.')
      setForm(initialForm)
      onSubmitted?.()
    } catch (error) {
      toast.error(getErrorMessage(error, 'Could not post your comment.'))
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-sm border border-paper-line/12 bg-canvas-panel p-5">
      <p className="eyebrow mb-4">Leave a comment</p>
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="field-label" htmlFor="name">Name</label>
          <input
            id="name"
            name="name"
            className="field-input"
            value={form.name}
            onChange={handleChange}
            placeholder="Your name"
            maxLength={80}
            required
          />
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email (optional)</label>
          <input
            id="email"
            name="email"
            type="email"
            className="field-input"
            value={form.email}
            onChange={handleChange}
            placeholder="you@example.com"
            maxLength={120}
          />
        </div>
      </div>
      <div className="mt-4">
        <label className="field-label" htmlFor="content">Comment</label>
        <textarea
          id="content"
          name="content"
          className="field-input min-h-[110px] resize-y"
          value={form.content}
          onChange={handleChange}
          placeholder="Share your thoughts…"
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
