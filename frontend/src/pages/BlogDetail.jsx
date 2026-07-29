import DOMPurify from 'dompurify'
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ArrowLeft, MessageCircle } from "lucide-react";
import { fetchBlogById } from "../api/blogs.js";
import { fetchCommentsForBlog } from "../api/comments.js";
import { getErrorMessage } from "../api/axios.js";
import { formatDate, readingTime } from "../utils/constants.js";
import CategoryTag from "../components/CategoryTag.jsx";
import CommentList from "../components/CommentList.jsx";
import CommentForm from "../components/CommentForm.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadComments = useCallback(() => {
    fetchCommentsForBlog(id)
      .then((res) => setComments(res.data.data || []))
      .catch(() => {});
  }, [id]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchBlogById(id)
      .then((res) => {
        if (cancelled) return;
        setBlog(res.data.data);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(getErrorMessage(err, "This post could not be found."));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    loadComments();
    return () => {
      cancelled = true;
    };
  }, [id, loadComments]);

  if (loading) return <Loader label="Opening the page" full />;

  if (error || !blog) {
    return (
      <div className="mx-auto max-w-2xl px-5 py-20">
        <EmptyState
          title="Post not found"
          description={
            error || "This post doesn't exist or may have been removed."
          }
          action={
            <button
              type="button"
              onClick={() => navigate("/")}
              className="btn-outline mt-2"
            >
              Back to home
            </button>
          }
        />
      </div>
    );
  }

  return (
    <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
      <Link
        to="/"
        className="eyebrow mb-8 inline-flex items-center gap-1.5 hover:text-paper"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> All posts
      </Link>

      <div className="mb-5 flex items-center gap-3">
        <CategoryTag>{blog.category}</CategoryTag>
        <span className="font-mono text-[11px] text-muted">
          {formatDate(blog.createdAt)}
        </span>
        <span className="font-mono text-[11px] text-muted">·</span>
        <span className="font-mono text-[11px] text-muted">
          {readingTime(blog.description)}
        </span>
      </div>

      <h1 className="font-display text-3xl font-semibold leading-tight text-paper sm:text-5xl">
        {blog.title}
      </h1>

      {blog.image && (
        <div className="dog-ear card-paper mt-8 overflow-hidden">
          <img
            src={blog.image}
            alt={blog.title}
            className="max-h-[480px] w-full object-cover"
          />
        </div>
      )}

      <div
        className="prose-blog mt-8 text-[17px] leading-[1.8] text-paper/90"
        dangerouslySetInnerHTML={{
          __html: DOMPurify.sanitize(blog.description),
        }}
      />

      <div className="mt-16 border-t border-paper-line/10 pt-10">
        <p className="eyebrow mb-6 flex items-center gap-2">
          <MessageCircle className="h-3.5 w-3.5" />
          {comments.length} comment{comments.length === 1 ? "" : "s"}
        </p>
        <CommentList comments={comments} />
        <div className="mt-8">
          <CommentForm blogId={blog._id} onSubmitted={loadComments} />
        </div>
      </div>
    </article>
  );
}
