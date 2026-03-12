import { Link } from 'react-router-dom'
import './home.css'

export function Home() {
  return (
    <div className="page home">
      <section className="home-hero card">
        <div className="home-hero-grid">
          <div className="home-copy">
            <h1 className="home-title">
              Asthma <span className="home-title-accent">Insight</span>
            </h1>
            <div className="home-underline" aria-hidden="true" />
            <p className="home-subtitle">Know your risk. Take control.</p>

            <div className="home-cta">
              <Link to="/symptom-checker" className="btn btn-primary">
                Start symptom check
              </Link>
              <div className="home-note muted">Takes about 1 minute.</div>
            </div>
          </div>

          <div className="home-visual" aria-hidden="true">
            <div className="breath-orb" />
            <div className="breath-orb glow" />
          </div>
        </div>
      </section>

      <footer className="home-footer">
        <div className="container home-footer-inner">
          <div className="home-footer-label">Disclaimer</div>
          <p className="home-footer-text">
            This app is for general informational purposes only and is not a substitute for professional medical
            advice, diagnosis, or treatment. If you’re experiencing a medical emergency, call 911 (or your local
            emergency number) immediately.
          </p>
        </div>
      </footer>
    </div>
  )
}

