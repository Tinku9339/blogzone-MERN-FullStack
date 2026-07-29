import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { FileText, CheckCircle2, PenSquare, MessageSquare, Clock, ArrowUpRight } from 'lucide-react'
import { fetchDashboardStats } from '../api/misc.js'
import { getErrorMessage } from '../api/axios.js'
import { useAuth } from '../context/AuthContext.jsx'
import { formatDate } from '../utils/constants.js'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import CategoryTag from '../components/CategoryTag.jsx'

function StatCard({ icon: Icon, label, value, tone = 'brass' }) {
  const toneClass = tone === 'sage' ? 'text-sage' : tone === 'rust' ? 'text-rust' : 'text-brass'
  return (
    <div className="card-paper flex items-center gap-4 p-5">
      <div className={`flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-full bg-ink/5 ${toneClass}`}>
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="font-display text-2xl font-semibold text-ink">{value}</p>
        <p className="font-mono text-[11px] uppercase tracking-[0.1em] text-ink/60">{label}</p>
      </div>
    </div>
  )
}

export default function Dashboard() {
  const { user } = useAuth()
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchDashboardStats()
      .then((res) => {
        if (!cancelled) setStats(res.data.data)
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, 'Could not load dashboard stats.'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  return (
    <div>
      <p className="eyebrow mb-2">The desk</p>
      <h1 className="font-display text-3xl font-semibold text-paper">
        Welcome back{user?.name ? `, ${user.name.split(' ')[0]}` : ''}.
      </h1>
      <p className="mt-2 text-sm text-muted">Here&apos;s how the shop is running.</p>

      {loading && <Loader label="Pulling the numbers" />}
      {!loading && error && <EmptyState title="Couldn't load stats" description={error} />}

      {!loading && !error && stats && (
        <>
          <div className="mt-8 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <StatCard icon={FileText} label="Total posts" value={stats.totalBlogs} />
            <StatCard icon={CheckCircle2} label="Published" value={stats.published} tone="sage" />
            <StatCard icon={PenSquare} label="Drafts" value={stats.drafts} />
            <StatCard icon={MessageSquare} label="Comments" value={stats.totalComments} />
          </div>

          {stats.pendingComments > 0 && (
            <Link
              to="/dashboard/comments"
              className="mt-6 flex items-center justify-between rounded-sm border border-rust/40 bg-rust/10 px-5 py-4 text-sm text-paper transition-colors hover:border-rust"
            >
              <span className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-rust" />
                {stats.pendingComments} comment{stats.pendingComments === 1 ? '' : 's'} waiting for review
              </span>
              <ArrowUpRight className="h-4 w-4 text-rust" />
            </Link>
          )}

          <div className="mt-10">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-display text-xl text-paper">Recent posts</h2>
              <Link to="/dashboard/blogs" className="eyebrow hover:text-paper">
                View all
              </Link>
            </div>

            {stats.recentBlogs?.length ? (
              <div className="flex flex-col divide-y divide-paper-line/10 rounded-sm border border-paper-line/10">
                {stats.recentBlogs.map((blog) => (
                  <Link
                    key={blog._id}
                    to={`/dashboard/blogs/${blog._id}/edit`}
                    className="flex items-center gap-4 px-4 py-3.5 transition-colors hover:bg-canvas-panel"
                  >
                    <img
                      src={blog.image}
                      alt={blog.title}
                      className="h-12 w-12 flex-shrink-0 rounded-sm object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-medium text-paper">{blog.title}</p>
                      <div className="mt-1 flex items-center gap-2">
                        <CategoryTag>{blog.category}</CategoryTag>
                        <span className="font-mono text-[11px] text-muted">
                          {formatDate(blog.createdAt)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`font-mono text-[10px] uppercase tracking-[0.1em] ${
                        blog.isPublished ? 'text-sage' : 'text-muted'
                      }`}
                    >
                      {blog.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <EmptyState
                title="No posts yet"
                description="Write your first post to see it here."
                action={
                  <Link to="/dashboard/blogs/new" className="btn-primary mt-2">
                    New post
                  </Link>
                }
              />
            )}
          </div>
        </>
      )}
    </div>
  )
}
