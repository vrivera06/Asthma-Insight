import './chips.css'

export function Chips({ items }) {
  if (!items?.length) return null
  return (
    <div className="chips" aria-label="Top contributing factors">
      {items.map((t) => (
        <span key={t} className="chip">
          {t}
        </span>
      ))}
    </div>
  )
}

