import { useMemo } from 'react'
import { Sheet } from './Sheet.jsx'
import { BY_ID, CATEGORIES, byCategory } from '../data/ingredients.js'
import { solveMeal } from '../lib/solver.js'
import { Tick, round } from './ui.jsx'

/**
 * Swap one slot for another ingredient in the same category.
 *
 * Each candidate previews the amount it would end up at, solved against the
 * same meal target — so the trade-off is visible before committing rather
 * than after.
 */
export function SwapSheet({ open, onClose, meal, slot, hidden, volumeFactor, onPick, onReset }) {
  const options = useMemo(() => {
    if (!meal || !slot) return []
    const pool = byCategory(slot.category).filter(
      (i) => !hidden.includes(i.id) || i.id === slot.id,
    )
    return pool
      .map((candidate) => {
        const trial = meal.slots.map((s) =>
          s.role === slot.role ? { ...s, id: candidate.id } : { ...s },
        )
        const solved = solveMeal(trial, meal.target, volumeFactor)
        const mine = solved.slots.find((s) => s.role === slot.role)
        return {
          ing: candidate,
          grams: mine?.grams ?? 0,
          mealKcal: solved.actual.kcal,
          isCurrent: candidate.id === slot.id,
        }
      })
      .sort((a, b) => (b.isCurrent ? 1 : 0) - (a.isCurrent ? 1 : 0) || a.ing.name.localeCompare(b.ing.name))
  }, [meal, slot, hidden, volumeFactor])

  if (!slot) return null
  const cat = CATEGORIES[slot.category]
  const current = BY_ID[slot.id]

  return (
    <Sheet
      open={open}
      onClose={onClose}
      title={`Swap ${cat.label.toLowerCase()}`}
      subtitle={`${meal?.label} · currently ${current?.name}. Amounts re-solve against this meal's target.`}
      footer={
        slot.swapped ? (
          <button type="button" className="btn btn--block" onClick={onReset}>
            Reset to the planned ingredient
          </button>
        ) : null
      }
    >
      <ul className="option-list">
        {options.map((o) => (
          <li key={o.ing.id}>
            <button
              type="button"
              className="option"
              aria-pressed={o.isCurrent}
              onClick={() => onPick(o.ing.id)}
            >
              <Tick checked={o.isCurrent} />
              <span className="option__main">
                <b>{o.ing.name}</b>
                <span>
                  {o.ing.kcal} kcal · {o.ing.protein} P · {o.ing.carbs} C · {o.ing.fat} F per 100 g
                  {o.ing.state !== '—' ? ` · ${o.ing.state}` : ''}
                </span>
              </span>
              <span className="option__side">
                <b style={{ fontSize: '1rem', fontWeight: 700 }}>{o.grams} g</b>
                <br />
                <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>
                  meal {round(o.mealKcal)} kcal
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </Sheet>
  )
}
