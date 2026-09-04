import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import {
  ArrowLeft as ArrowLeftIcon,
  Mail as MailIcon,
  BookOpen as BookOpenIcon,
  Calendar as CalendarIcon,
  Copy as CopyIcon,
  Check as CheckIcon,
  User as UserIconComponent,
} from "lucide-react";
import toast from "react-hot-toast";
import { fetchAuthorProfile } from "../api/profile.js";
import { getErrorMessage } from "../api/axios.js";
import BlogCard from "../components/BlogCard.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";
import CategoryTag from "../components/CategoryTag.jsx";
import { formatDate, initials } from "../utils/constants.js";

export default function AuthorProfile() {
  const { id } = useParams();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");

    fetchAuthorProfile(id)
      .then((res) => {
        if (!cancelled) {
          setData(res.data.data || null);
        }
      })
      .catch((err) => {
        if (!cancelled) {
          setError(getErrorMessage(err, "Could not load author profile."));
        }
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleCopyEmail = (email) => {
    if (!email) return;
    navigator.clipboard.writeText(email).then(() => {
      setCopied(true);
      toast.success("Author email copied to clipboard!");
      setTimeout(() => setCopied(false), 2000);
    });
  };

  if (loading) {
    return <Loader label="Loading author profile" full />;
  }

  if (error || !data || !data.author) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <EmptyState
          title="Author not found"
          description={
            error || "We couldn't find the author you are looking for."
          }
          action={
            <Link to="/" className="btn-outline mt-3 inline-flex items-center gap-1.5">
              <ArrowLeftIcon className="h-4 w-4" /> Back to home
            </Link>
          }
        />
      </div>
    );
  }

  const { author, blogs = [] } = data;

  return (
    <div className="mx-auto max-w-5xl px-5 py-12 sm:px-8">
      {/* Back Navigation */}
      <Link
        to="/"
        className="eyebrow mb-8 inline-flex items-center gap-1.5 hover:text-paper"
      >
        <ArrowLeftIcon className="h-3.5 w-3.5" /> All posts
      </Link>

      {/* Author Hero Header */}
      <section className="rounded-sm border border-paper-line/15 bg-canvas-panel p-6 sm:p-10 shadow-sm">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-start">
          {author.profileImage ? (
            <img
              src={author.profileImage}
              alt={author.name}
              className="h-24 w-24 rounded-full object-cover border-2 border-brass/40 shadow-md flex-shrink-0"
            />
          ) : (
            <div className="flex h-24 w-24 items-center justify-center rounded-full bg-canvas-raised font-display text-3xl font-bold text-brass border-2 border-brass/30 flex-shrink-0">
              {initials(author.name) || <UserIconComponent className="h-10 w-10" />}
            </div>
          )}

          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="eyebrow text-[11px] text-brass">Contributor</span>
              {Array.isArray(author.writingCategory) && author.writingCategory.length > 0 ? (
                author.writingCategory.map((cat) => (
                  <CategoryTag key={cat}>{cat}</CategoryTag>
                ))
              ) : typeof author.writingCategory === "string" && author.writingCategory.trim() ? (
                <CategoryTag>{author.writingCategory}</CategoryTag>
              ) : null}
            </div>

            <h1 className="mt-2 font-display text-3xl font-bold text-paper sm:text-4xl">
              {author.name}
            </h1>

            {author.bio && (
              <p className="mt-2 text-base text-paper/85 italic leading-relaxed">
                "{author.bio}"
              </p>
            )}

            {author.description && (
              <p className="mt-3 text-sm text-muted leading-relaxed whitespace-pre-line">
                {author.description}
              </p>
            )}

            {/* Author Quick Stats & Info */}
            <div className="mt-6 flex flex-wrap items-center gap-6 border-t border-paper-line/15 pt-4 text-xs text-muted">
              <span className="flex items-center gap-1.5 font-mono">
                <BookOpenIcon className="h-3.5 w-3.5 text-brass" />
                <strong className="text-paper font-semibold">{blogs.length}</strong>{" "}
                published {blogs.length === 1 ? "article" : "articles"}
              </span>

              {author.createdAt && (
                <span className="flex items-center gap-1.5 font-mono">
                  <CalendarIcon className="h-3.5 w-3.5 text-brass" />
                  Joined {formatDate(author.createdAt)}
                </span>
              )}

              {author.email && (
                <a
                  href={`mailto:${author.email}`}
                  className="flex items-center gap-1.5 font-mono text-brass hover:underline"
                >
                  <MailIcon className="h-3.5 w-3.5" />
                  {author.email}
                </a>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Published Blogs Section */}
      <section className="mt-14">
        <div className="mb-6 flex items-baseline justify-between border-b border-paper-line/10 pb-4">
          <div>
            <p className="eyebrow text-[11px] text-brass">Writing catalog</p>
            <h2 className="font-display text-2xl font-bold text-paper sm:text-3xl">
              Articles by {author.name}
            </h2>
          </div>
          <span className="font-mono text-xs text-muted">
            {blogs.length} post{blogs.length === 1 ? "" : "s"}
          </span>
        </div>

        {blogs.length === 0 ? (
          <EmptyState
            title="No published articles yet"
            description={`${author.name} hasn't published any articles yet.`}
          />
        ) : (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {blogs.map((blog) => (
              <BlogCard key={blog._id} blog={blog} />
            ))}
          </div>
        )}
      </section>

      {/* Contact Author Footer Card */}
      {author.email && (
        <section className="rounded-sm border border-paper-line/15 bg-canvas-panel mt-16 p-6 sm:p-8 text-center sm:text-left shadow-sm">
          <div className="flex flex-col items-center justify-between gap-6 sm:flex-row">
            <div className="flex items-center gap-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brass/10 text-brass border border-brass/30 flex-shrink-0">
                <MailIcon className="h-6 w-6" />
              </div>
              <div>
                <p className="eyebrow text-[10px] text-brass">Get in touch</p>
                <h3 className="font-display text-lg font-semibold text-paper">
                  Contact {author.name}
                </h3>
                <p className="text-xs text-muted mt-0.5">
                  Have questions or want to collaborate? Reach out directly via email.
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3">
              <a
                href={`mailto:${author.email}`}
                className="btn-primary inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase px-4 py-2.5"
              >
                <MailIcon className="h-3.5 w-3.5" />
                <span>Send Email</span>
              </a>
              <button
                type="button"
                onClick={() => handleCopyEmail(author.email)}
                className="btn-outline inline-flex items-center gap-2 text-xs font-mono tracking-wider uppercase px-4 py-2.5 text-paper border-paper-line/30 hover:border-brass hover:text-brass transition-colors"
                title="Copy email address"
              >
                {copied ? (
                  <>
                    <CheckIcon className="h-3.5 w-3.5 text-sage" />
                    <span className="text-sage">Copied</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="h-3.5 w-3.5 text-paper" />
                    <span className="text-paper">Copy Address</span>
                  </>
                )}
              </button>
            </div>
          </div>
          <div className="mt-4 pt-3 border-t border-paper-line/10 text-center sm:text-left">
            <span className="font-mono text-xs text-muted">
              Direct email:{" "}
              <a
                href={`mailto:${author.email}`}
                className="font-semibold text-paper hover:text-brass transition-colors underline underline-offset-4"
              >
                {author.email}
              </a>
            </span>
          </div>
        </section>
      )}
    </div>
  );
}
