import DOMPurify from 'dompurify'
import { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import toast from "react-hot-toast";
import {
  ArrowLeft,
  MessageCircle,
  Heart,
  Share2,
  Copy,
  Check,
  User as UserIcon,
} from "lucide-react";
import { fetchBlogById, likeBlog } from "../api/blogs.js";
import { fetchCommentsForBlog, deleteComment } from "../api/comments.js";
import { getErrorMessage } from "../api/axios.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatDate, readingTime, initials } from "../utils/constants.js";
import CategoryTag from "../components/CategoryTag.jsx";
import CommentList from "../components/CommentList.jsx";
import CommentForm from "../components/CommentForm.jsx";
import Loader from "../components/Loader.jsx";
import EmptyState from "../components/EmptyState.jsx";

export default function BlogDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const [blog, setBlog] = useState(null);
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [scrollProgress, setScrollProgress] = useState(0);

  const [likesCount, setLikesCount] = useState(0);
  const [isLiked, setIsLiked] = useState(false);
  const [liking, setLiking] = useState(false);
  const [copied, setCopied] = useState(false);

  // Reading progress scroll tracker
  useEffect(() => {
    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollTop;
      const windowHeight =
        document.documentElement.scrollHeight -
        document.documentElement.clientHeight;
      if (windowHeight > 0) {
        const scroll = (totalScroll / windowHeight) * 100;
        setScrollProgress(Number(scroll.toFixed(1)));
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const loadComments = useCallback(() => {
    fetchCommentsForBlog(id)
      .then((res) => setComments(res.data.data || []))
      .catch(() => {});
  }, [id]);

  // Real-time background sync for comments (polls every 5s)
  useEffect(() => {
    if (!id) return;
    const pollInterval = setInterval(() => {
      fetchCommentsForBlog(id)
        .then((res) => {
          if (res.data?.data) {
            setComments(res.data.data);
          }
        })
        .catch(() => {});
    }, 5000);

    return () => clearInterval(pollInterval);
  }, [id]);

  const handleCommentAdded = (newComment) => {
    if (newComment) {
      setComments((prev) => [newComment, ...prev.filter((c) => c._id !== newComment._id)]);
    }
    loadComments();
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await deleteComment(commentId);
      setComments((prev) => prev.filter((c) => c._id !== commentId));
      toast.success("Comment deleted");
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not delete comment."));
    }
  };

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError("");
    fetchBlogById(id)
      .then((res) => {
        if (cancelled) return;
        const b = res.data.data;
        setBlog(b);
        setLikesCount(b.likesCount || b.likes?.length || 0);
        if (user && b.likes) {
          setIsLiked(b.likes.some((uId) => (uId._id || uId).toString() === user._id.toString()));
        }
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
  }, [id, loadComments, user]);

  const handleLike = async () => {
    if (!isAuthenticated) {
      toast("Sign in to like this post", { icon: "💡" });
      navigate("/login", { state: { from: `/blog/${id}` } });
      return;
    }
    if (liking) return;
    setLiking(true);
    try {
      const res = await likeBlog(id);
      const data = res.data.data;
      setLikesCount(data.likesCount);
      setIsLiked(data.isLiked);
      if (data.isLiked) {
        toast.success("Post liked!");
      }
    } catch (err) {
      toast.error(getErrorMessage(err, "Could not update like."));
    } finally {
      setLiking(false);
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast.success("Link copied to clipboard!");
      setTimeout(() => setCopied(false), 2500);
    } catch {
      toast.error("Could not copy link.");
    }
  };

  const handleShareTwitter = () => {
    const url = encodeURIComponent(window.location.href);
    const text = encodeURIComponent(`Reading "${blog?.title}" on BlogZone:`);
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, "_blank");
  };

  const handleShareWhatsApp = () => {
    const text = encodeURIComponent(`Check out this post on BlogZone: "${blog?.title}"\n${window.location.href}`);
    window.open(`https://api.whatsapp.com/send?text=${text}`, "_blank");
  };

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
    <>
      {/* Reading Progress Indicator */}
      <div
        className="fixed top-0 left-0 z-50 h-[3px] bg-brass transition-all duration-150 ease-out"
        style={{ width: `${scrollProgress}%` }}
      />

      <article className="mx-auto max-w-3xl px-5 py-12 sm:px-8">
        <Link
          to="/"
          className="eyebrow mb-8 inline-flex items-center gap-1.5 hover:text-paper"
        >
          <ArrowLeft className="h-3.5 w-3.5" /> All posts
        </Link>

        <div className="mb-5 flex flex-wrap items-center gap-3">
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

        {/* Author Metadata Bar */}
        {blog.author && (
          <div className="mt-6 flex items-center justify-between border-y border-paper-line/10 py-3.5">
            <Link
              to={`/author/${blog.author._id || blog.author}`}
              className="flex items-center gap-3 group"
            >
              {blog.author.profileImage ? (
                <img
                  src={blog.author.profileImage}
                  alt={blog.author.name}
                  className="h-10 w-10 rounded-full object-cover border border-paper-line/20 group-hover:border-brass/50 transition-colors"
                />
              ) : (
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-canvas-panel font-mono text-sm text-brass border border-paper-line/20 group-hover:border-brass/50 transition-colors">
                  {initials(blog.author.name) || <UserIcon className="h-4 w-4" />}
                </div>
              )}
              <div>
                <p className="text-sm font-medium text-paper group-hover:text-brass transition-colors">
                  {blog.author.name}
                </p>
                {blog.author.bio && (
                  <p className="text-xs text-muted line-clamp-1">{blog.author.bio}</p>
                )}
              </div>
            </Link>

            <Link
              to={`/author/${blog.author._id || blog.author}`}
              className="font-mono text-[11px] uppercase tracking-[0.1em] text-brass hover:underline"
            >
              Author Profile &rarr;
            </Link>
          </div>
        )}

        {blog.image && (
          <div className="dog-ear card-paper mt-8 overflow-hidden">
            <img
              src={blog.image}
              alt={blog.title}
              className="max-h-[480px] w-full object-cover"
            />
          </div>
        )}

        {/* Content Body */}
        <div
          className="prose-blog mt-8 text-[17px] leading-[1.8] text-paper/90"
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(blog.description, {
              ADD_ATTR: ['style', 'class', 'target', 'data-value'],
              ADD_TAGS: ['u', 's', 'strike', 'sub', 'sup', 'code', 'pre', 'blockquote', 'hr', 'img'],
            }),
          }}
        />

        {/* Engagement Action Bar: Likes + Social Share */}
        <div className="mt-12 flex flex-wrap items-center justify-between gap-4 rounded-sm border border-paper-line/15 bg-canvas-panel px-5 py-4">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleLike}
              disabled={liking}
              className={`flex items-center gap-2 rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-[0.08em] transition-colors ${
                isLiked
                  ? "border-rust/40 bg-rust/10 text-rust"
                  : "border-paper-line/25 text-muted hover:border-rust hover:text-rust"
              }`}
            >
              <Heart
                className={`h-4 w-4 transition-transform active:scale-125 ${
                  isLiked ? "fill-rust text-rust" : ""
                }`}
              />
              <span>{likesCount} {likesCount === 1 ? "Like" : "Likes"}</span>
            </button>
          </div>

          <div className="flex items-center gap-2">
            <span className="eyebrow hidden text-[10px] sm:inline">Share</span>
            <button
              type="button"
              onClick={handleCopyLink}
              title="Copy link"
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-paper-line/20 text-muted transition-colors hover:border-brass hover:text-brass"
            >
              {copied ? <Check className="h-4 w-4 text-sage" /> : <Copy className="h-4 w-4" />}
            </button>
            <button
              type="button"
              onClick={handleShareTwitter}
              title="Share on X / Twitter"
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-paper-line/20 text-muted transition-colors hover:border-brass hover:text-brass font-mono text-xs font-bold"
            >
              𝕏
            </button>
            <button
              type="button"
              onClick={handleShareWhatsApp}
              title="Share on WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-sm border border-paper-line/20 text-muted transition-colors hover:border-brass hover:text-brass"
            >
              <Share2 className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Author Bio Box */}
        {blog.author && (
          <div className="rounded-sm border border-paper-line/15 bg-canvas-panel mt-10 p-6 sm:p-7 shadow-sm">
            <div className="flex items-center justify-between gap-3 border-b border-paper-line/10 pb-3 mb-5">
              <p className="eyebrow text-[10px] text-brass m-0">Written by</p>
              <Link
                to={`/author/${blog.author._id || blog.author}`}
                className="group inline-flex items-center gap-1 font-mono text-[11px] font-semibold uppercase tracking-[0.1em] text-brass hover:text-brass-glow transition-colors"
                title={`Visit ${blog.author.name}'s profile`}
              >
                <span>Visit Author Profile</span>
                <span className="transition-transform group-hover:translate-x-0.5" aria-hidden="true">&rarr;</span>
              </Link>
            </div>

            <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
              {blog.author.profileImage ? (
                <Link
                  to={`/author/${blog.author._id || blog.author}`}
                  className="flex-shrink-0"
                >
                  <img
                    src={blog.author.profileImage}
                    alt={blog.author.name}
                    className="h-16 w-16 rounded-full object-cover border border-paper-line/30 hover:border-brass transition-colors"
                  />
                </Link>
              ) : (
                <Link
                  to={`/author/${blog.author._id || blog.author}`}
                  className="flex-shrink-0"
                >
                  <div className="flex h-16 w-16 items-center justify-center rounded-full bg-canvas-raised font-display text-xl text-brass border border-paper-line/30 hover:border-brass transition-colors">
                    {initials(blog.author.name) || <UserIcon className="h-6 w-6" />}
                  </div>
                </Link>
              )}
              <div className="min-w-0 flex-1">
                <Link
                  to={`/author/${blog.author._id || blog.author}`}
                  className="inline-block font-display text-lg font-semibold text-paper hover:text-brass transition-colors"
                >
                  {blog.author.name}
                </Link>
                <p className="mt-1 text-sm text-muted">
                  {blog.author.bio || blog.author.description || "Writer and contributor at BlogZone."}
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Comments Section */}
        <div className="mt-16 border-t border-paper-line/10 pt-10">
          <p className="eyebrow mb-6 flex items-center gap-2">
            <MessageCircle className="h-3.5 w-3.5" />
            {comments.length} comment{comments.length === 1 ? "" : "s"}
          </p>
          <CommentList
            comments={comments}
            postAuthorId={blog.author}
            onDeleteComment={handleDeleteComment}
          />
          <div className="mt-8">
            <CommentForm blogId={blog._id} onSubmitted={handleCommentAdded} />
          </div>
        </div>
      </article>
    </>
  );
}
