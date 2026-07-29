export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-sm border border-dashed border-paper-line/25 px-6 py-16 text-center">
      {Icon && <Icon className="h-8 w-8 text-muted" strokeWidth={1.5} />}
      <p className="font-display text-lg text-paper">{title}</p>
      {description && <p className="max-w-sm text-sm text-muted">{description}</p>}
      {action}
    </div>
  )
}
