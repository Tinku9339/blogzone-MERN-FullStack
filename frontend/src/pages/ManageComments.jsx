import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Check, Trash2, ExternalLink } from 'lucide-react'
import { fetchAllComments, approveComment, deleteComment } from '../api/comments.js'
import { getErrorMessage } from '../api/axios.js'
import { formatDateTime, initials } from '../utils/constants.js'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

const FILTERS = ['Pending', 'Approved', 'All']

export default function ManageComments() {
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('Pending')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    setLoading(true)
    fetchAllComments()
      .then((res) => setComments(res.data.data || []))
      .catch((err) => setError(getErrorMessage(err, 'Could not load comments.')))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    return [...comments]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((c) => {
        if (filter === 'Pending') return !c.isApproved
        if (filter === 'Approved') return c.isApproved
        return true
      })
  }, [comments, filter])

  const handleApprove = async (comment) => {
    setBusyId(comment._id)
    try {
      const res = await approveComment(comment._id)
      setComments((prev) => prev.map((c) => (c._id === comment._id ? { ...c, ...res.data.data } : c)))
      toast.success('Comment approved')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not approve this comment.'))
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setBusyId(pendingDelete._id)
    try {
      await deleteComment(pendingDelete._id)
      setComments((prev) => prev.filter((c) => c._id !== pendingDelete._id))
      toast.success('Comment deleted')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete this comment.'))
    } finally {
      setBusyId(null)
      setPendingDelete(null)
    }
  }

  const pendingCount = comments.filter((c) => !c.isApproved).length

  return (
    <div>
      <p className="eyebrow mb-2">Reader replies</p>
      <h1 className="font-display text-3xl font-semibold text-paper">Comments</h1>
      <p className="mt-2 text-sm text-muted">{pendingCount} waiting for review.</p>

      <div className="mt-6 flex gap-1">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => setFilter(f)}
            className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.1em] transition-colors ${
              filter === f
                ? 'border-brass bg-brass text-canvas'
                : 'border-paper-line/25 text-muted hover:border-brass hover:text-brass'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="mt-6">
        {loading && <Loader label="Loading comments" />}
        {!loading && error && <EmptyState title="Couldn't load comments" description={error} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title={filter === 'Pending' ? 'Nothing to review' : 'No comments here'}
            description={filter === 'Pending' ? "You're all caught up." : 'Try a different filter.'}
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="flex flex-col gap-4">
            {filtered.map((comment) => (
              <div key={comment._id} className="rounded-sm border border-paper-line/12 bg-canvas-panel p-4 sm:p-5">
                <div className="flex items-start gap-3">
                  <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-canvas-raised font-mono text-xs text-brass">
                    {initials(comment.name) || '?'}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div>
                        <p className="text-sm font-medium text-paper">{comment.name}</p>
                        <p className="font-mono text-[11px] text-muted">
                          {comment.email || 'no email'} · {formatDateTime(comment.createdAt)}
                        </p>
                      </div>
                      <span
                        className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                          comment.isApproved ? 'text-sage' : 'text-rust'
                        }`}
                      >
                        {comment.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                    <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-paper/85">
                      {comment.content}
                    </p>
                    {comment.blogId && (
                      <Link
                        to={`/blog/${comment.blogId._id || comment.blogId}`}
                        target="_blank"
                        rel="noreferrer"
                        className="mt-3 inline-flex items-center gap-1 font-mono text-[11px] text-muted hover:text-brass"
                      >
                        <ExternalLink className="h-3 w-3" />
                        {comment.blogId.title || 'View post'}
                      </Link>
                    )}
                  </div>
                </div>
                <div className="mt-4 flex justify-end gap-2 border-t border-paper-line/10 pt-3">
                  {!comment.isApproved && (
                    <button
                      type="button"
                      onClick={() => handleApprove(comment)}
                      disabled={busyId === comment._id}
                      className="btn-outline !border-sage/50 !text-sage hover:!bg-sage/10"
                    >
                      <Check className="h-3.5 w-3.5" /> Approve
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => setPendingDelete(comment)}
                    disabled={busyId === comment._id}
                    className="btn-ghost !text-rust/80 hover:!text-rust"
                  >
                    <Trash2 className="h-3.5 w-3.5" /> Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this comment?"
        description="This can't be undone."
        confirmLabel="Delete comment"
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={busyId === pendingDelete?._id}
      />
    </div>
  )
}
