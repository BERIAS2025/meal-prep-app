import { useId } from 'react'
import { IconAlert, IconCheck, IconInfo } from './Icons.jsx'

export const round = (n) => Math.round(n || 0)

/** Progress meter with a real accessible name and value. */
export function Meter({ value, max, label, over }) {
  const pct = max > 0 ? Math.min(100, (value / max) * 100) : 0
  return (
    <div
      className="meter"
      role="progressbar"
      aria-valuenow={round(value)}
      aria-valuemin={0}
      aria-valuemax={round(max)}
      aria-valuetext={`${round(value)} of ${round(max)}`}
      aria-label={label}
    >
      <div className={`meter__fill${over ? ' meter__fill--over' : ''}`} style={{ width: `${pct}%` }} />
    </div>
  )
}

export function Stat({ label, value, unit, sub, meter, dotColor }) {
  return (
    <div className="stat">
      <div className="stat__label">
        {dotColor && <span className="dot" style={{ background: `var(--${dotColor})` }} />}
        {label}
      </div>
      <div className="stat__value">
        {value}
        {unit && <small> {unit}</small>}
      </div>
      {sub && <div className="stat__sub">{sub}</div>}
      {meter}
    </div>
  )
}

const MACROS = [
  { key: 'protein', label: 'Protein', color: 'protein' },
  { key: 'carbs', label: 'Carbs', color: 'carb' },
  { key: 'fat', label: 'Fat', color: 'fat' },
]

export function MacroChips({ macros, showFiber }) {
  return (
    <div className="macro-chips">
      {MACROS.map((m) => (
        <span className="macro-chip" key={m.key}>
          <i style={{ background: `var(--${m.color})` }} />
          <b>{round(macros[m.key])} g</b>
          <span className="sr-only">{m.label}</span>
          <span aria-hidden="true">{m.label.slice(0, 1)}</span>
        </span>
      ))}
      {showFiber && (
        <span className="macro-chip">
          <b>{round(macros.fiber)} g</b>
          <span aria-hidden="true">fiber</span>
          <span className="sr-only">fiber</span>
        </span>
      )}
    </div>
  )
}

export function Notice({ tone = 'info', children, icon }) {
  const Ico = icon || (tone === 'info' ? IconInfo : IconAlert)
  return (
    <div className={`notice notice--${tone}`} role={tone === 'info' ? undefined : 'note'}>
      <Ico />
      <div>{children}</div>
    </div>
  )
}

/** Segmented control. `options` = [{ id, label, title? }] */
export function Seg({ options, value, onChange, label }) {
  return (
    <div className="seg" role="group" aria-label={label}>
      {options.map((o) => (
        <button
          key={o.id}
          type="button"
          className="seg__btn"
          aria-pressed={value === o.id}
          title={o.title}
          onClick={() => onChange(o.id)}
        >
          {o.label}
        </button>
      ))}
    </div>
  )
}

export function Stepper({ value, onChange, min = 1, max = 8, label, suffix }) {
  const id = useId()
  return (
    <div className="stepper">
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(Math.max(min, value - 1))}
        disabled={value <= min}
        aria-label={`Decrease ${label}`}
      >
        −
      </button>
      <output className="stepper__value" htmlFor={id} aria-live="polite">
        {value}
        {suffix ? ` ${suffix}` : ''}
      </output>
      <button
        type="button"
        className="stepper__btn"
        onClick={() => onChange(Math.min(max, value + 1))}
        disabled={value >= max}
        aria-label={`Increase ${label}`}
      >
        +
      </button>
    </div>
  )
}

export function Field({ label, hint, children, htmlFor }) {
  return (
    <div className="field">
      <label htmlFor={htmlFor}>{label}</label>
      {children}
      {hint && <span className="field__hint">{hint}</span>}
    </div>
  )
}

export function Tick({ checked }) {
  return (
    <span className="tick" data-checked={checked ? 'true' : 'false'}>
      {checked && <IconCheck size={16} strokeWidth={2.6} />}
    </span>
  )
}

export function Empty({ icon: Ico, title, children }) {
  return (
    <div className="empty">
      {Ico && <Ico size={34} />}
      <h3>{title}</h3>
      <p>{children}</p>
    </div>
  )
}
