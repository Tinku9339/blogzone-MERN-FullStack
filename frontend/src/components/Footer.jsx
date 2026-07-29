export default function Footer() {
  return (
    <footer className="border-t border-paper-line/10 py-10">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-3 px-5 text-center sm:flex-row sm:justify-between sm:text-left">
        <p className="font-display text-lg text-paper">
          Blog<span className="text-brass">Zone</span>
        </p>
        <p className="eyebrow">Written, edited, and published from one desk.</p>
        <p className="font-mono text-xs text-muted">© {new Date().getFullYear()} BlogZone</p>
      </div>
    </footer>
  )
}
