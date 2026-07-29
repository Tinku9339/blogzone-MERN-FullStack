import { MessageCircle } from 'lucide-react'
import { formatDateTime, initials } from '../utils/constants.js'

export default function CommentList({ comments }) {
  if (!comments.length) {
    return (
      <div className="flex flex-col items-center gap-2 rounded-sm border border-dashed border-paper-line/25 py-10 text-center">
        <MessageCircle className="h-6 w-6 text-muted" strokeWidth={1.5} />
        <p className="text-sm text-muted">No comments yet — be the first to respond.</p>
      </div>
    )
  }

  return (
    <ul className="flex flex-col gap-5">
      {comments.map((comment) => (
        <li key={comment._id} className="flex gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-canvas-raised font-mono text-xs text-brass">
            {initials(comment.name) || '?'}
          </div>
          <div className="min-w-0 flex-1 rounded-sm border border-paper-line/12 bg-canvas-panel p-4">
            <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
              <p className="text-sm font-medium text-paper">{comment.name}</p>
              <p className="font-mono text-[11px] text-muted">{formatDateTime(comment.createdAt)}</p>
            </div>
            <p className="mt-2 whitespace-pre-wrap text-sm leading-relaxed text-paper/85">
              {comment.content}
            </p>
          </div>
        </li>
      ))}
    </ul>
  )
}
