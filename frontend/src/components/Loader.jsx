export default function Loader({ label = 'Loading', full = false }) {
  return (
    <div
      className={
        full
          ? 'flex min-h-[50vh] w-full flex-col items-center justify-center gap-3'
          : 'flex w-full flex-col items-center justify-center gap-3 py-16'
      }
    >
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-paper-line/30 border-t-brass" />
      <p className="eyebrow">{label}…</p>
    </div>
  )
}
