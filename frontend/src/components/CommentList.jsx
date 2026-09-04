import { MessageCircle, Trash2 } from 'lucide-react'
import { formatDateTime, initials } from '../utils/constants.js'
import { useAuth } from '../context/AuthContext.jsx'

export default function CommentList({ comments, postAuthorId, onDeleteComment }) {
  const { user } = useAuth()

  if (!comments.length) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-sm border border-dashed border-paper-line/25 py-10 text-center">
        <MessageCircle className="h-6 w-6 text-muted" strokeWidth={1.5} />
        <p className="text-sm text-muted">No comments yet — be the first to respond.</p>
      </div>
    )
  }

  const postAuthorStr = postAuthorId?._id?.toString() || postAuthorId?.toString() || ''
  const currentUserIdStr = user?._id?.toString() || ''

  return (
    <ul className="flex flex-col gap-5">
      {comments.map((comment) => {
        const commenterIdStr =
          comment.userId?._id?.toString() || comment.userId?.toString() || ''
        const isCommenter =
          Boolean(currentUserIdStr && commenterIdStr && commenterIdStr === currentUserIdStr) ||
          Boolean(user?.email && comment.email && comment.email.toLowerCase() === user.email.toLowerCase())
        const isPostAuthor = Boolean(currentUserIdStr && postAuthorStr && postAuthorStr === currentUserIdStr)
        const canDelete = isCommenter || isPostAuthor

        const isWrittenByAuthor =
          Boolean(commenterIdStr && postAuthorStr && commenterIdStr === postAuthorStr)

        return (
          <li key={comment._id} className="group flex gap-3">
            {comment.userId?.profileImage ? (
              <img
                src={comment.userId.profileImage}
                alt={comment.name}
                className="h-9 w-9 flex-shrink-0 rounded-full object-cover border border-paper-line/30"
              />
            ) : (
              <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-canvas-raised font-mono text-xs text-brass border border-paper-line/20">
                {initials(comment.name) || '?'}
              </div>
            )}
            <div className="min-w-0 flex-1 rounded-sm border border-paper-line/12 bg-canvas-panel p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div className="flex items-center gap-2">
                  <p className="text-sm font-medium text-paper">{comment.name}</p>
                  {isWrittenByAuthor && (
                    <span className="rounded-full bg-brass/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.1em] text-brass">
                      Author
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  <p className="font-mono text-[11px] text-muted">{formatDateTime(comment.createdAt)}</p>
                  {canDelete && onDeleteComment && (
                    <button
                      type="button"
                      onClick={() => onDeleteComment(comment._id)}
                      title={isPostAuthor && !isCommenter ? "Delete comment (as Post Author)" : "Delete your comment"}
                      className="opacity-70 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-mono text-[11px] text-rust/70 hover:text-rust"
                    >
                      <Trash2 className="h-3 w-3" />
                      <span className="text-[10px] uppercase tracking-[0.08em]">Delete</span>
                    </button>
                  )}
                </div>
              </div>
              <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-paper/85">
                {comment.content}
              </p>
            </div>
          </li>
        )
      })}
    </ul>
  )
}
