import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Feather } from 'lucide-react'
import { fetchPublishedBlogs } from '../api/blogs.js'
import { getErrorMessage } from '../api/axios.js'
import BlogCard from '../components/BlogCard.jsx'
import CategoryFilter from '../components/CategoryFilter.jsx'
import Loader from '../components/Loader.jsx'
import EmptyState from '../components/EmptyState.jsx'
import { useAuth } from '../context/AuthContext.jsx'

export default function Home() {
  const { isAuthenticated } = useAuth()
  const [blogs, setBlogs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [category, setCategory] = useState('All')

  useEffect(() => {
    let cancelled = false
    setLoading(true)
    fetchPublishedBlogs()
      .then((res) => {
        if (cancelled) return
        setBlogs(res.data.data || [])
      })
      .catch((err) => {
        if (cancelled) return
        setError(getErrorMessage(err, 'Could not load posts.'))
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
    const sorted = [...blogs].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    if (category === 'All') return sorted
    return sorted.filter((b) => b.category === category)
  }, [blogs, category])

  const [featured, ...rest] = filtered

  return (
    <div>
      <section className="relative overflow-hidden border-b border-paper-line/10">
        <div className="pointer-events-none absolute inset-0 bg-glow" />
        <div className="relative mx-auto max-w-6xl px-5 py-16 sm:px-8 sm:py-24">
          <p className="eyebrow mb-4 flex items-center gap-2">
            <Feather className="h-3.5 w-3.5" /> Stories · Perspectives · Ideas
          </p>
          <h1 className="max-w-3xl font-display text-4xl font-semibold leading-[1.08] text-paper sm:text-6xl">
            Where thoughts find words, and stories connect minds.
          </h1>
          <p className="mt-5 max-w-xl text-base text-muted sm:text-lg leading-relaxed">
            BlogZone is a shared space for passionate writers and curious readers.
            Publish your insights, explore diverse perspectives, and build meaningful
            connections through the power of the written word.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-12 sm:px-8">
        {loading && <Loader label="Fetching the latest posts" full />}

        {!loading && error && (
          <EmptyState title="Couldn't load posts" description={error} />
        )}

        {!loading && !error && blogs.length === 0 && (
          <EmptyState
            title="Nothing published yet"
            description="Once a post goes live, it'll show up here."
          />
        )}

        {!loading && !error && blogs.length > 0 && (
          <>
            <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <CategoryFilter categories={categories} active={category} onChange={setCategory} />
              <p className="font-mono text-[11px] text-muted">
                {filtered.length} post{filtered.length === 1 ? '' : 's'}
              </p>
            </div>

            {filtered.length === 0 ? (
              <EmptyState
                title={`No posts in "${category}" yet`}
                description="Try another category."
              />
            ) : (
              <div className="flex flex-col gap-6">
                {featured && <BlogCard blog={featured} featured />}
                {rest.length > 0 && (
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {rest.map((blog) => (
                      <BlogCard key={blog._id} blog={blog} />
                    ))}
                  </div>
                )}
              </div>
            )}
          </>
        )}
      </section>

      {!isAuthenticated && (
        <section className="border-t border-paper-line/10 py-12">
          <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center sm:px-8">
            <p className="font-display text-xl text-paper">Have something to publish?</p>
            <p className="max-w-md text-sm text-muted">
              Sign in to the desk to draft, edit, and publish posts of your own.
            </p>
            <Link to="/signup" className="btn-outline mt-2">
              Create an account
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
