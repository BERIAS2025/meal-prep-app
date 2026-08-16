import { useMemo, useState } from 'react'
import { useDispatch, useStore, useTargets } from '../state/store.jsx'
import { buildShoppingList } from '../lib/plan.js'
import { CATEGORIES } from '../data/ingredients.js'
import { addDays, formatDate, todayKey, weekStart } from '../lib/date.js'
import { Notice, Stepper, Tick } from '../components/ui.jsx'
import { IconChevronLeft, IconChevronRight } from '../components/Icons.jsx'

const fmtAmount = (g) => (g >= 1000 ? `${(g / 1000).toFixed(g % 1000 === 0 ? 0 : 2)} kg` : `${g} g`)

export function ShoppingView() {
  const state = useStore()
  const dispatch = useDispatch()
  const targets = useTargets()
  const [startKey, setStartKey] = useState(() => weekStart(todayKey()))
  const [copied, setCopied] = useState(false)

  const list = useMemo(
    () => buildShoppingList(state, targets, startKey),
    [state, targets, startKey],
  )
  const checks = state.shoppingChecks[startKey] || {}
  const checkedCount = list.items.filter((i) => checks[i.id]).length

  const copyList = async () => {
    const text = list.groups
      .map(
        (g) =>
          `${CATEGORIES[g.category].label}\n` +
          g.items.map((i) => `  ${i.name} — ${fmtAmount(i.buyG)}${i.buyNote ? ` (${i.buyNote})` : ''}`).join('\n'),
      )
      .join('\n\n')
    try {
      await navigator.clipboard.writeText(
        `Shopping list ${formatDate(startKey)} – ${formatDate(addDays(startKey, 6))}\n\n${text}`,
      )
      setCopied(true)
      setTimeout(() => setCopied(false), 2200)
    } catch {
      setCopied(false)
    }
  }

  return (
    <div className="stack stack--lg">
      <div className="row row--between">
        <button
          type="button"
          className="icon-btn"
          onClick={() => setStartKey(addDays(startKey, -7))}
          aria-label="Previous week"
        >
          <IconChevronLeft />
        </button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontWeight: 700 }}>
            {formatDate(startKey)} – {formatDate(addDays(startKey, 6))}
          </div>
          <div className="dim tnum" style={{ fontSize: '0.8125rem' }}>
            {list.items.length} items · {checkedCount} in the basket
          </div>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setStartKey(addDays(startKey, 7))}
          aria-label="Next week"
        >
          <IconChevronRight />
        </button>
      </div>

      <div className="card" style={{ padding: 14 }}>
        <div className="row row--between">
          <div>
            <b style={{ fontSize: '0.9375rem' }}>Portions per meal</b>
            <div className="dim" style={{ fontSize: '0.75rem' }}>
              Cooking for more than yourself scales the list, not the plan.
            </div>
          </div>
          <Stepper
            value={state.portions}
            onChange={(portions) => dispatch({ type: 'portions', portions })}
            label="portions"
          />
        </div>
      </div>

      <Notice tone="info">
        Amounts shown are what to <b>buy</b>: raw and untrimmed for meat and vegetables, dry for rice
        and quinoa. The eaten amount underneath is the cooked weight the plan uses. Yield factors are
        approximations — a scale at the counter beats them every time.
      </Notice>

      <div className="row row--wrap">
        <button type="button" className="btn btn--sm" onClick={copyList}>
          {copied ? 'Copied' : 'Copy list'}
        </button>
        {checkedCount > 0 && (
          <button
            type="button"
            className="btn btn--sm btn--ghost"
            onClick={() => dispatch({ type: 'clearShopping', weekKey: startKey })}
          >
            Clear ticks
          </button>
        )}
        <span aria-live="polite" className="sr-only">
          {copied ? 'Shopping list copied to clipboard' : ''}
        </span>
      </div>

      {list.groups.map((group) => (
        <section key={group.category} aria-labelledby={`shop-${group.category}`}>
          <div className="section-head">
            <h2 id={`shop-${group.category}`}>{CATEGORIES[group.category].label}</h2>
            <span className="dim" style={{ fontSize: '0.75rem' }}>
              {group.items.length}
            </span>
          </div>
          <div className="card">
            <ul className="list">
              {group.items.map((item) => {
                const checked = !!checks[item.id]
                return (
                  <li key={item.id}>
                    <button
                      type="button"
                      className={`list__item${checked ? ' list__item--checked' : ''}`}
                      aria-pressed={checked}
                      onClick={() =>
                        dispatch({ type: 'shoppingCheck', weekKey: startKey, itemId: item.id })
                      }
                    >
                      <Tick checked={checked} />
                      <span className="list__main">
                        <b>{item.name}</b>
                        <span>
                          {[item.buyNote, `used ${item.usedOn.length}×`, item.note]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </span>
                      <span className="list__side">
                        <b>{fmtAmount(item.buyG)}</b>
                        <span>{fmtAmount(item.eatenG)} eaten</span>
                      </span>
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        </section>
      ))}
    </div>
  )
}
