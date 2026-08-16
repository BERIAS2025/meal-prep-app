import { useMemo, useState } from 'react'
import { useDispatch, useStore, useTargets } from '../state/store.jsx'
import { buildPrepTasks, prepDayKeys } from '../lib/plan.js'
import { CATEGORIES, BY_ID } from '../data/ingredients.js'
import {
  WEEKDAY_LONG,
  addDays,
  daysBetween,
  formatDate,
  todayKey,
  weekStart,
  weekdayOf,
} from '../lib/date.js'
import { Empty, Notice, Tick, round } from '../components/ui.jsx'
import { IconChevronLeft, IconChevronRight, IconPrep, IconTrash } from '../components/Icons.jsx'

const fmtAmount = (g) => (g >= 1000 ? `${(g / 1000).toFixed(2)} kg` : `${g} g`)

function eatByTone(eatBy) {
  const d = daysBetween(todayKey(), eatBy)
  if (d < 0) return { tone: 'alert', text: `${Math.abs(d)} day${Math.abs(d) === 1 ? '' : 's'} past` }
  if (d === 0) return { tone: 'warn', text: 'Eat today' }
  if (d === 1) return { tone: 'warn', text: 'Eat by tomorrow' }
  return { tone: 'ok', text: `Good until ${formatDate(eatBy, { weekday: 'short' })}` }
}

export function PrepView() {
  const state = useStore()
  const dispatch = useDispatch()
  const targets = useTargets()
  const [startKey, setStartKey] = useState(() => weekStart(todayKey()))

  const prepKeys = useMemo(() => prepDayKeys(state, startKey), [state, startKey])
  const [activeKey, setActiveKey] = useState(null)
  const prepKey = activeKey && prepKeys.includes(activeKey) ? activeKey : prepKeys[0]

  const plan = useMemo(
    () => (prepKey ? buildPrepTasks(state, targets, startKey, prepKey) : null),
    [state, targets, startKey, prepKey],
  )

  const checks = state.prepChecks[prepKey] || {}
  const doneCount = plan ? plan.tasks.filter((t) => checks[t.id]).length : 0

  const toggleTask = (task) => {
    const willBeChecked = !checks[task.id]
    dispatch({ type: 'prepCheck', prepKey, taskId: task.id })
    if (willBeChecked) {
      dispatch({
        type: 'addStorageBatch',
        items: [
          {
            sourceId: task.id,
            ingredientId: task.ingredientId,
            name: task.name,
            grams: task.eatenG,
            preppedOn: prepKey,
            eatBy: task.eatBy,
          },
        ],
      })
    } else {
      dispatch({ type: 'removeStorageBySource', sourceId: task.id })
    }
  }

  const storage = [...state.storageItems].sort((a, b) => a.eatBy.localeCompare(b.eatBy))
  const shortfalls = plan?.tasks.filter((t) => t.shortfallDays > 0) || []

  return (
    <div className="stack stack--lg">
      <div className="row row--between">
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            setStartKey(addDays(startKey, -7))
            setActiveKey(null)
          }}
          aria-label="Previous week"
        >
          <IconChevronLeft />
        </button>
        <div style={{ textAlign: 'center', flex: 1 }}>
          <div style={{ fontWeight: 700 }}>Prep week of {formatDate(startKey)}</div>
          <div className="dim" style={{ fontSize: '0.8125rem' }}>
            {state.prepDays.map((d) => WEEKDAY_LONG[d]).join(' and ')}
          </div>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => {
            setStartKey(addDays(startKey, 7))
            setActiveKey(null)
          }}
          aria-label="Next week"
        >
          <IconChevronRight />
        </button>
      </div>

      {!prepKey ? (
        <Empty icon={IconPrep} title="No prep days set">
          Choose which weekdays you cook ahead on in Settings.
        </Empty>
      ) : (
        <>
          {prepKeys.length > 1 && (
            <div className="seg" role="group" aria-label="Prep day">
              {prepKeys.map((k) => (
                <button
                  key={k}
                  type="button"
                  className="seg__btn"
                  aria-pressed={k === prepKey}
                  onClick={() => setActiveKey(k)}
                >
                  {WEEKDAY_LONG[weekdayOf(k)]}
                </button>
              ))}
            </div>
          )}

          <section aria-labelledby="prep-head">
            <div className="section-head">
              <h2 id="prep-head">
                Cook on {WEEKDAY_LONG[weekdayOf(prepKey)]}, {formatDate(prepKey)}
              </h2>
              <span className="dim tnum" style={{ fontSize: '0.75rem' }}>
                {doneCount}/{plan.tasks.length}
              </span>
            </div>
            <p className="dim" style={{ fontSize: '0.8125rem', marginBottom: 10 }}>
              Covers {plan.covered.length} day{plan.covered.length === 1 ? '' : 's'} —{' '}
              {formatDate(plan.covered[0], { weekday: 'short' })} through{' '}
              {formatDate(plan.covered[plan.covered.length - 1], { weekday: 'short' })}
              {plan.portions > 1 ? ` · ${plan.portions} portions per meal` : ''}
            </p>

            {plan.tasks.length === 0 ? (
              <Empty icon={IconPrep} title="Nothing to cook ahead">
                Everything on these days is assembled fresh.
              </Empty>
            ) : (
              <div className="card">
                <ul className="list">
                  {plan.tasks.map((task) => {
                    const checked = !!checks[task.id]
                    const tone = eatByTone(task.eatBy)
                    return (
                      <li key={task.id}>
                        <button
                          type="button"
                          className={`list__item${checked ? ' list__item--checked' : ''}`}
                          aria-pressed={checked}
                          onClick={() => toggleTask(task)}
                        >
                          <Tick checked={checked} />
                          <span
                            className="dot"
                            style={{ background: `var(--${CATEGORIES[task.category].color})` }}
                          />
                          <span className="list__main">
                            <b>{task.name}</b>
                            <span>
                              {task.servings} serving{task.servings === 1 ? '' : 's'} ·{' '}
                              {tone.text}
                              {task.shortfallDays > 0 ? ' · needs a top-up later' : ''}
                            </span>
                          </span>
                          <span className="list__side">
                            <b>
                              {fmtAmount(task.buyG)}
                              {task.rawLabel ? ` ${task.rawLabel}` : ''}
                            </b>
                            <span>{fmtAmount(task.eatenG)} eaten</span>
                          </span>
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )}
          </section>

          {shortfalls.length > 0 && (
            <Notice tone="warn">
              <b>Some of this will not keep the whole window.</b>{' '}
              {shortfalls.map((t) => t.name).join(', ')} — cook the later portions closer to the day
              rather than all at once on {WEEKDAY_LONG[weekdayOf(prepKey)]}.
            </Notice>
          )}
        </>
      )}

      <section aria-labelledby="storage-head">
        <div className="section-head">
          <h2 id="storage-head">In the fridge</h2>
          <span className="dim" style={{ fontSize: '0.75rem' }}>
            {storage.length} item{storage.length === 1 ? '' : 's'}
          </span>
        </div>
        {storage.length === 0 ? (
          <Empty icon={IconPrep} title="Nothing tracked yet">
            Ticking a prep task adds it here with an eat-by date.
          </Empty>
        ) : (
          <div className="card">
            <ul className="list">
              {storage.map((item) => {
                const tone = eatByTone(item.eatBy)
                const ing = BY_ID[item.ingredientId]
                return (
                  <li key={item.id} className="list__item" style={{ cursor: 'default' }}>
                    <span
                      className="dot"
                      style={{ background: `var(--${CATEGORIES[ing?.category || 'protein'].color})` }}
                    />
                    <span className="list__main">
                      <b>{item.name}</b>
                      <span>
                        Prepped {formatDate(item.preppedOn, { weekday: 'short' })} ·{' '}
                        {fmtAmount(round(item.grams))}
                      </span>
                    </span>
                    <span
                      className={`chip${tone.tone === 'ok' ? '' : tone.tone === 'warn' ? ' chip--warn' : ' chip--alert'}`}
                    >
                      {tone.text}
                    </span>
                    <button
                      type="button"
                      className="icon-btn"
                      onClick={() => dispatch({ type: 'deleteStorage', id: item.id })}
                      aria-label={`Remove ${item.name} from the fridge list`}
                    >
                      <IconTrash size={17} />
                    </button>
                  </li>
                )
              })}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
