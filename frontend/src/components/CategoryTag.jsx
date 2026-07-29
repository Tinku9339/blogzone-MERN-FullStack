export default function CategoryTag({ children, tone = 'brass' }) {
  const toneClass =
    tone === 'sage'
      ? 'border-sage/50 text-sage'
      : tone === 'rust'
      ? 'border-rust/60 text-rust'
      : 'border-brass/50 text-brass'

  return (
    <span
      className={`inline-flex items-center rounded-full border px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-[0.12em] ${toneClass}`}
    >
      {children}
    </span>
  )
}
