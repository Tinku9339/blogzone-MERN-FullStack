import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import toast from 'react-hot-toast'
import { Plus, Pencil, Trash2, Eye, EyeOff, Search } from 'lucide-react'
import { fetchMyBlogs, deleteBlog, updateBlog } from '../api/blogs.js'
import { getErrorMessage } from '../api/axios.js'
import { formatDate } from '../utils/constants.js'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import CategoryTag from '../components/CategoryTag.jsx'
import ConfirmDialog from '../components/ConfirmDialog.jsx'

const FILTERS = ['All', 'Published', 'Drafts']

export default function ManageBlogs() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [filter, setFilter] = useState('All')
  const [query, setQuery] = useState('')
  const [pendingDelete, setPendingDelete] = useState(null)
  const [busyId, setBusyId] = useState(null)

  const load = () => {
    setLoading(true)
    fetchMyBlogs()
      .then((res) => setBlogs(res.data.data || []))
      .catch((err) => setError(getErrorMessage(err, 'Could not load posts.')))
      .finally(() => setLoading(false))
  }

  useEffect(load, [])

  const filtered = useMemo(() => {
    return [...blogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((b) => {
        if (filter === 'Published') return b.isPublished
        if (filter === 'Drafts') return !b.isPublished
        return true
      })
      .filter((b) => (query.trim() ? b.title.toLowerCase().includes(query.trim().toLowerCase()) : true))
  }, [blogs, filter, query])

  const handleTogglePublish = async (blog) => {
    setBusyId(blog._id)
    try {
      const res = await updateBlog(blog._id, { isPublished: !blog.isPublished })
      setBlogs((prev) => prev.map((b) => (b._id === blog._id ? res.data.data : b)))
      toast.success(res.data.data.isPublished ? 'Post published' : 'Moved to drafts')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not update the post.'))
    } finally {
      setBusyId(null)
    }
  }

  const handleDelete = async () => {
    if (!pendingDelete) return
    setBusyId(pendingDelete._id)
    try {
      await deleteBlog(pendingDelete._id)
      setBlogs((prev) => prev.filter((b) => b._id !== pendingDelete._id))
      toast.success('Post deleted')
    } catch (err) {
      toast.error(getErrorMessage(err, 'Could not delete the post.'))
    } finally {
      setBusyId(null)
      setPendingDelete(null)
    }
  }

  return (
    <div>
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="eyebrow mb-2">Every draft and post</p>
          <h1 className="font-display text-3xl font-semibold text-paper">Posts</h1>
        </div>
        <Link to="/dashboard/blogs/new" className="btn-primary">
          <Plus className="h-4 w-4" /> New post
        </Link>
      </div>

      <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-1">
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
        <div className="relative sm:w-64">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className="field-input pl-9"
            placeholder="Search by title…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="mt-6">
        {loading && <Loader label="Loading posts" />}
        {!loading && error && <EmptyState title="Couldn't load posts" description={error} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState
            title="No posts here"
            description="Try a different filter, or write something new."
            action={
              <Link to="/dashboard/blogs/new" className="btn-primary mt-2">
                <Plus className="h-4 w-4" /> New post
              </Link>
            }
          />
        )}

        {!loading && !error && filtered.length > 0 && (
          <div className="flex flex-col divide-y divide-paper-line/10 rounded-sm border border-paper-line/10">
            {filtered.map((blog) => (
              <div key={blog._id} className="flex flex-col gap-3 px-4 py-4 sm:flex-row sm:items-center">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="h-14 w-14 flex-shrink-0 rounded-sm object-cover"
                />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium text-paper">{blog.title}</p>
                  <div className="mt-1.5 flex flex-wrap items-center gap-2">
                    <CategoryTag>{blog.category}</CategoryTag>
                    <span className="font-mono text-[11px] text-muted">{formatDate(blog.createdAt)}</span>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                        blog.isPublished ? 'text-sage' : 'text-muted'
                      }`}
                    >
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </div>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleTogglePublish(blog)}
                    disabled={busyId === blog._id}
                    title={blog.isPublished ? 'Move to drafts' : 'Publish'}
                    className="flex h-9 w-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-canvas-panel hover:text-brass disabled:opacity-40"
                  >
                    {blog.isPublished ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                  <Link
                    to={`/dashboard/blogs/${blog._id}/edit`}
                    title="Edit"
                    className="flex h-9 w-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-canvas-panel hover:text-paper"
                  >
                    <Pencil className="h-4 w-4" />
                  </Link>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(blog)}
                    title="Delete"
                    className="flex h-9 w-9 items-center justify-center rounded-sm text-muted transition-colors hover:bg-canvas-panel hover:text-rust"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <ConfirmDialog
        open={Boolean(pendingDelete)}
        title="Delete this post?"
        description={`"${pendingDelete?.title}" and its comments will remain in the database, but the post will be permanently removed. This can't be undone.`}
        confirmLabel="Delete post"
        onConfirm={handleDelete}
        onCancel={() => setPendingDelete(null)}
        loading={busyId === pendingDelete?._id}
      />
    </div>
  )
}
