import { AlertTriangle } from 'lucide-react'

export default function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  danger = true,
  onConfirm,
  onCancel,
  loading = false,
}) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-canvas/80 px-4 backdrop-blur-sm">
      <div className="w-full max-w-sm rounded-sm border border-paper-line/15 bg-canvas-raised p-6 shadow-paper">
        <div className="flex items-start gap-3">
          <div
            className={`flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full ${
              danger ? 'bg-rust/15 text-rust' : 'bg-brass/15 text-brass'
            }`}
          >
            <AlertTriangle className="h-4 w-4" />
          </div>
          <div>
            <p className="font-display text-lg text-paper">{title}</p>
            {description && <p className="mt-1 text-sm text-muted">{description}</p>}
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button type="button" className="btn-ghost" onClick={onCancel} disabled={loading}>
            Cancel
          </button>
          <button
            type="button"
            className={danger ? 'btn-danger' : 'btn-primary'}
            onClick={onConfirm}
            disabled={loading}
          >
            {loading ? 'Working…' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
