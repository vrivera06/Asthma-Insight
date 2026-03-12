import './togglePills.css'

export function TogglePills({ name, value, onChange, options, disabled }) {
  return (
    <div className="pills" role="group" aria-label={name}>
      {options.map((opt) => {
        const active = value === opt.value
        return (
          <button
            key={opt.value}
            type="button"
            className={active ? 'pill active' : 'pill'}
            onClick={() => onChange(name, opt.value)}
            disabled={disabled}
          >
            {opt.label}
          </button>
        )
      })}
    </div>
  )
}

