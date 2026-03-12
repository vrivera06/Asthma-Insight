import './gauge.css'

export function Gauge({ value, color }) {
  const pct = Math.max(0, Math.min(100, value))
  const r = 54
  const c = 2 * Math.PI * r
  const dash = (pct / 100) * c

  return (
    <div className="gauge" aria-label={`Risk ${pct}%`}>
      <svg viewBox="0 0 140 140" className="gauge-svg" role="img">
        <circle className="gauge-track" cx="70" cy="70" r={r} />
        <circle
          className="gauge-progress"
          cx="70"
          cy="70"
          r={r}
          style={{
            stroke: color,
            strokeDasharray: `${dash} ${c - dash}`,
          }}
        />
      </svg>
      <div className="gauge-center">
        <div className="gauge-value">{pct}%</div>
        <div className="gauge-sub">Risk</div>
      </div>
    </div>
  )
}

