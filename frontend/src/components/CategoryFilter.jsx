export default function CategoryFilter({ categories, active, onChange }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <button
        type="button"
        onClick={() => onChange('All')}
        className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
          active === 'All'
            ? 'border-brass bg-brass text-canvas'
            : 'border-paper-line/25 text-muted hover:border-brass hover:text-brass'
        }`}
      >
        All posts
      </button>
      {categories.map((cat) => (
        <button
          key={cat}
          type="button"
          onClick={() => onChange(cat)}
          className={`rounded-full border px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${
            active === cat
              ? 'border-brass bg-brass text-canvas'
              : 'border-paper-line/25 text-muted hover:border-brass hover:text-brass'
          }`}
        >
          {cat}
        </button>
      ))}
    </div>
  )
}
