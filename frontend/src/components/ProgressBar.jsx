import './progressBar.css'

export function ProgressBar({ step, total, label }) {
  const pct = Math.round((step / total) * 100)
  return (
    <div className="progress">
      <div className="progress-top">
        <div className="progress-title">{label}</div>
        <div className="progress-meta">
          Step {step} of {total}
        </div>
      </div>

      <div className="progress-track" role="progressbar" aria-valuenow={step} aria-valuemin={1} aria-valuemax={total}>
        <div className="progress-fill" style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

