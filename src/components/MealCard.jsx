import { BY_ID, CATEGORIES } from '../data/ingredients.js'
import { pieceHint } from '../lib/solver.js'
import { formatTime } from '../lib/date.js'
import { IconCheck, IconInfo, IconSwap } from './Icons.jsx'
import { MacroChips, round } from './ui.jsx'

export function MealCard({ meal, isNow, onSwap, onToggleDone, onInfo, onSauce, onRemove }) {
  if(meal.customItems) return <article className="card personal-card"><div className="row row--between"><h3>{meal.title}</h3><b>{round(meal.actual.kcal)} kcal</b></div><p>{meal.label} · {formatTime(meal.time)}</p><ul>{meal.customItems.map((i,n)=><li key={n}>{i.name}: {i.amount} × {i.serving}</li>)}</ul><MacroChips macros={meal.actual}/><p className="dim">Gespeicherte Etikettwerte. Keine automatische Portionsänderung.</p><div className="row row--wrap"><button className="btn" aria-pressed={meal.done} onClick={()=>onToggleDone(meal)}>{meal.done?'Als gegessen erfasst':'Als gegessen markieren'}</button><button className="btn" onClick={()=>onRemove(meal)}>{meal.key.startsWith('extra_')?'Extra entfernen':'Standardmahlzeit wiederherstellen'}</button></div></article>
  const offTarget = Math.abs(meal.actual.kcal - meal.target.kcal) > meal.target.kcal * 0.12

  return (
    <article
      className={`card meal${isNow ? ' meal--now' : ''}${meal.done ? ' meal--done' : ''}`}
      aria-labelledby={`meal-${meal.key}-title`}
    >
      <div className="meal__head">
        <div className="meal__time">
          {formatTime(meal.time)}
          <span>{meal.label}</span>
        </div>
        <div className="meal__titles">
          <h3 id={`meal-${meal.key}-title`}>{meal.title}</h3>
        </div>
        <div className="meal__kcal">
          <strong className="tnum">{round(meal.actual.kcal)}</strong>
          <span>kcal</span>
        </div>
      </div>

      <div className="why">
        <IconInfo size={15} />
        <div>
          {meal.why}{' '}
          <button type="button" className="link-btn" onClick={() => onInfo(meal)}>
            Why this works
          </button>
        </div>
      </div>

      <ul className="slots">
        {meal.slots.map((slot) => {
          const ing = BY_ID[slot.id]
          const hint = pieceHint(slot.id, slot.grams)
          return (
            <li key={slot.role}>
              <button
                type="button"
                className="slot"
                onClick={() => onSwap(meal, slot)}
                aria-label={`${ing.name}, ${slot.grams} grams. Swap this ${CATEGORIES[slot.category].label.toLowerCase()}.`}
              >
                <span className="dot" style={{ background: `var(--${CATEGORIES[slot.category].color})` }} />
                <span className="slot__name">
                  <b>{ing.name}</b>
                  <span className="slot__hint">
                    {[
                      ing.state !== '—' ? ing.state : null,
                      hint,
                      slot.swapped ? 'swapped' : null,
                      slot.replacedFor ? `instead of ${BY_ID[slot.replacedFor].name}` : null,
                    ]
                      .filter(Boolean)
                      .join(' · ')}
                  </span>
                </span>
                <span className="slot__amount tnum">{slot.grams} g</span>
                <IconSwap size={16} className="slot__swap" />
              </button>
            </li>
          )
        })}

        {onSauce && (
          <li>
            <button
              type="button"
              className="slot"
              onClick={() => onSauce(meal)}
              aria-label={`Sauce: ${meal.sauce.name}. Change it.`}
            >
              <span className="dot" style={{ background: 'var(--condiment)' }} />
              <span className="slot__name">
                <b>{meal.sauce.id === 'none' ? 'No sauce' : meal.sauce.name}</b>
                <span className="slot__hint">
                  {meal.sauce.id === 'none' ? 'tap to add one' : 'sauce · counted in the totals'}
                </span>
              </span>
              <span className="slot__amount tnum">
                {meal.sauce.id === 'none' ? '—' : `${round(meal.sauceMacros.kcal)} kcal`}
              </span>
              <IconSwap size={16} className="slot__swap" />
            </button>
          </li>
        )}
      </ul>

      <div className="meal__foot">
        <MacroChips macros={meal.actual} />
        {offTarget && (
          <span className="chip chip--warn" title={`Target ${round(meal.target.kcal)} kcal`}>
            {meal.actual.kcal > meal.target.kcal ? '+' : '−'}
            {round(Math.abs(meal.actual.kcal - meal.target.kcal))} vs plan
          </span>
        )}
        <button
          type="button"
          className="check"
          aria-pressed={meal.done}
          onClick={() => onToggleDone(meal)}
        >
          <IconCheck size={15} strokeWidth={2.6} />
          {meal.done ? 'Eaten' : 'Mark eaten'}
        </button>
      </div>
    </article>
  )
}
