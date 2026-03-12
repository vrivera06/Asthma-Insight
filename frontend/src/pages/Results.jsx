import { useLocation, useNavigate } from 'react-router-dom'
import { Gauge } from '../components/Gauge.jsx'
import { Chips } from '../components/Chips.jsx'
import './results.css'

function levelColor(level) {
  if (level === 'High') return 'var(--color-danger)'
  if (level === 'Moderate') return 'var(--color-warning)'
  return 'var(--color-success)'
}

export function Results() {
  const location = useLocation()
  const navigate = useNavigate()
  const results = location.state?.results

  if (!results) {
    return (
      <div className="page results">
        <div className="results-card card">
          <h1 className="results-title">Results</h1>
          <p className="muted">No results to show yet.</p>
          <button className="btn btn-primary" onClick={() => navigate('/symptom-checker', { replace: true })}>
            Start symptom check
          </button>
        </div>
      </div>
    )
  }

  const pct = Math.round((results.riskScore ?? 0) * 100)
  const color = levelColor(results.riskLevel)

  return (
    <div className="page results">
      <div className="results-grid">
        <section className="results-card card">
          <h1 className="results-title">Your results</h1>

          <div className="results-top">
            <Gauge value={pct} color={color} />
            <div className="results-summary">
              <div className="results-level" style={{ color }}>
                {results.riskLevel} risk
              </div>
              <div className="results-diagnosis">{results.diagnosis}</div>
              <div className="muted">Estimated risk based on the factors you provided.</div>
            </div>
          </div>

          <div className="results-section">
            <h2 className="results-h2">What this means</h2>
            <ul className="results-list">
              {(results.advice || []).map((a) => (
                <li key={a}>{a}</li>
              ))}
            </ul>
          </div>

          <div className="results-section">
            <h2 className="results-h2">Top factors</h2>
            <Chips items={results.topFactors || []} />
          </div>

          <div className="results-actions">
            <button className="btn" onClick={() => navigate('/symptom-checker', { replace: true })}>
              Start over
            </button>
            <button className="btn btn-primary" onClick={() => navigate('/symptom-checker')}>
              Check again
            </button>
          </div>
        </section>

        <aside className="results-disclaimer card">
          <h2 className="results-h2">Disclaimer</h2>
          <p className="results-disclaimer-text">
            The information provided here is for general informational purposes only and is not a substitute for
            professional advice, diagnosis, or treatment. For personalized guidance, consult a licensed healthcare
            professional. If you are experiencing a medical emergency, call 911 (or your local emergency number)
            immediately.
          </p>
        </aside>
      </div>
    </div>
  )
}

