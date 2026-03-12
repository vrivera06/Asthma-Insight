import { NavLink } from 'react-router-dom'
import './navbar.css'

export function Navbar() {
  return (
    <header className="nav">
      <div className="container nav-inner">
        <NavLink to="/" className="nav-logo" aria-label="Asthma Insight home">
          <span className="nav-mark" aria-hidden="true" />
          <span className="nav-title">Asthma Insight</span>
        </NavLink>

        <nav className="nav-links" aria-label="Primary">
          <NavLink to="/symptom-checker" className={({ isActive }) => (isActive ? 'nav-link active' : 'nav-link')}>
            Symptom Checker
          </NavLink>
        </nav>
      </div>
    </header>
  )
}

