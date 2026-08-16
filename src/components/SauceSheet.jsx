import { useMemo, useState } from 'react'
import { Sheet } from './Sheet.jsx'
import { availableSauces, sauceMacros } from '../data/sauces.js'
import { BY_ID } from '../data/ingredients.js'
import { Tick, round } from './ui.jsx'

/**
 * Pick a sauce for one meal. Every option shows what it costs, because that is
 * the whole reason sauces are modelled rather than waved through: a spoon of
 * something on every plate is 100–150 kcal a meal.
 */
export function SauceSheet({ open, onClose, meal, hidden, onPick }) {
  const [expanded, setExpanded] = useState(null)

  const options = useMemo(() => {
    return availableSauces(hidden).map((s) => ({
      sauce: s,
      macros: sauceMacros(s.id),
      isCurrent: s.id === meal?.sauce?.id,
    }))
  }, [hidden, meal])

  if (!meal) return null

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title="Choose a sauce"
      subtitle={`${meal.label} · the sauce is counted in this meal, so the plate shrinks to make room for it`}
    >
      <ul className="option-list">
        {options.map(({ sauce, macros, isCurrent }) => (
          <li key={sauce.id}>
            <button type="button" className="option" aria-pressed={isCurrent} onClick={() => onPick(sauce.id)}>
              <Tick checked={isCurrent} />
              <span className="option__main">
                <b>{sauce.name}</b>
                <span>
                  {sauce.id === 'none'
                    ? 'Meat and vegetables plain'
                    : `${sauce.components.map((c) => `${c.grams} g ${BY_ID[c.id].name.toLowerCase()}`).join(' · ')}`}
                </span>
              </span>
              <span className="option__side">
                <b style={{ fontSize: '1rem', fontWeight: 700 }}>{round(macros.kcal)}</b>
                <br />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>
                  {sauce.id === 'none' ? '—' : `kcal · ${round(macros.protein)} P`}
                </span>
              </span>
            </button>

            {sauce.id !== 'none' && (
              <div style={{ padding: '2px 0 10px 12px' }}>
                <button
                  type="button"
                  className="link-btn"
                  aria-expanded={expanded === sauce.id}
                  onClick={() => setExpanded(expanded === sauce.id ? null : sauce.id)}
                >
                  {expanded === sauce.id ? 'Hide method' : 'How to make it'}
                </button>
                {expanded === sauce.id && (
                  <div className="card card--flat" style={{ padding: 12, marginTop: 8 }}>
                    <p style={{ fontSize: '0.875rem', lineHeight: 1.55 }}>{sauce.method}</p>
                    <p className="dim" style={{ fontSize: '0.75rem', marginTop: 8 }}>
                      Keeps {sauce.keeps} days in the fridge
                      {sauce.goesWith ? ` · goes with ${sauce.goesWith.toLowerCase()}` : ''}
                    </p>
                  </div>
                )}
              </div>
            )}
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
