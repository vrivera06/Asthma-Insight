import './spinner.css'

export function Spinner({ label = 'Loading' }) {
  return (
    <div className="spinner" role="status" aria-live="polite" aria-label={label}>
      <div className="spinner-ring" />
      <div className="spinner-text">{label}</div>
    </div>
  )
}

