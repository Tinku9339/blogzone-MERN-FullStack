import { useEffect, useMemo, useState } from 'react'
import { Search } from 'lucide-react'
import { fetchPublishedBlogs } from '../api/blogs.js'
import { getErrorMessage } from '../api/axios.js'
import BlogCard from '../components/BlogCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'

export default function Archive() {
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All')
  const [query, setQuery] = useState('')

  useEffect(() => {
    let cancelled = false
    fetchPublishedBlogs()
      .then((res) => {
        if (!cancelled) setBlogs(res.data.data || [])
      })
      .catch((err) => {
        if (!cancelled) setError(getErrorMessage(err, 'Could not load posts.'))
      })
      .finally(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const categories = useMemo(
    () => [...new Set(blogs.map((b) => b.category).filter(Boolean))].sort(),
    [blogs]
  )

  const filtered = useMemo(() => {
    return [...blogs]
      .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
      .filter((b) => category === 'All' || b.category === category)
      .filter((b) =>
        query.trim()
          ? `${b.title} ${b.description}`.toLowerCase().includes(query.trim().toLowerCase())
          : true
      )
  }, [blogs, category, query])

  return (
    <div className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
      <p className="eyebrow mb-3">The full run</p>
      <h1 className="font-display text-3xl font-semibold text-paper sm:text-4xl">Archive</h1>
      <p className="mt-2 max-w-lg text-sm text-muted">
        Every published post, searchable by title, topic, or category.
      </p>

      <div className="mt-8 flex flex-col gap-4">
        <div className="relative max-w-sm">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted" />
          <input
            className="field-input pl-9"
            placeholder="Search posts…"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
        </div>
        <CategoryFilter categories={categories} active={category} onChange={setCategory} />
      </div>

      <div className="mt-8">
        {loading && <Loader label="Loading the archive" />}
        {!loading && error && <EmptyState title="Couldn't load posts" description={error} />}
        {!loading && !error && filtered.length === 0 && (
          <EmptyState title="No matching posts" description="Try a different search or category." />
        )}
        {!loading && !error && filtered.length > 0 && (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
