import { useMemo, useState } from 'react'
import { useDispatch, useStore, useTargets } from '../state/store.jsx'
import { buildWeek } from '../lib/plan.js'
import { DAY_TYPES } from '../lib/nutrition.js'
import {
  WEEKDAY_LONG,
  WEEKDAY_SHORT,
  addDays,
  formatDate,
  todayKey,
  weekStart,
} from '../lib/date.js'
import { useMediaQuery } from '../lib/useMediaQuery.js'
import { Notice, Seg, round } from '../components/ui.jsx'
import { IconChevronLeft, IconChevronRight, IconDumbbell, IconRest, IconRun } from '../components/Icons.jsx'

const TYPE_ICON = { rest: IconRest, cardio: IconRun, strength: IconDumbbell }

export function WeekView({ onOpenDay }) {
  const state = useStore()
  const dispatch = useDispatch()
  const targets = useTargets()
  const [startKey, setStartKey] = useState(() => weekStart(todayKey()))
  const [applyMode, setApplyMode] = useState('day')
  const wide = useMediaQuery('(min-width: 1000px)')

  const days = useMemo(() => buildWeek(state, targets, startKey), [state, targets, startKey])
  const today = todayKey()
  const weekAvg = Math.round(days.reduce((n, d) => n + d.totals.kcal, 0) / 7)

  const setType = (day, dayType) => {
    if (applyMode === 'every') {
      dispatch({ type: 'weekType', weekday: day.weekday, dayType })
      dispatch({ type: 'clearDayType', dateKey: day.dateKey })
    } else {
      dispatch({ type: 'dayType', dateKey: day.dateKey, dayType })
    }
  }

  const typeOptions = DAY_TYPES.map((d) => ({ id: d.id, label: d.short, title: d.desc }))

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
            {weekAvg} kcal average · target {targets.kcal}
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

      <div className="stack stack--sm">
        <span className="dim" style={{ fontSize: '0.75rem', fontWeight: 650 }}>
          Changing a training day applies to
        </span>
        <Seg
          label="Scope of training-day changes"
          value={applyMode}
          onChange={setApplyMode}
          options={[
            { id: 'day', label: 'This date only' },
            { id: 'every', label: 'Every week' },
          ]}
        />
      </div>

      {wide ? (
        <div className="scroll-x">
          <table className="week">
            <caption className="sr-only">
              Weekly meal plan from {formatDate(startKey)} to {formatDate(addDays(startKey, 6))}
            </caption>
            <thead>
              <tr>
                <th scope="col">Day</th>
                <th scope="col">Training</th>
                <th scope="col">Breakfast</th>
                <th scope="col">Lunch</th>
                <th scope="col">Snack</th>
                <th scope="col">Dinner</th>
                <th scope="col">Total</th>
              </tr>
            </thead>
            <tbody>
              {days.map((day) => {
                const get = (k) => day.meals.find((m) => m.key === k)
                const shake = get('shake')
                return (
                  <tr key={day.dateKey} className={day.dateKey === today ? 'is-today' : undefined}>
                    <th scope="row">
                      <button type="button" className="link-btn" onClick={() => onOpenDay(day.dateKey)}>
                        {WEEKDAY_LONG[day.weekday]}
                      </button>
                      <div className="dim" style={{ fontWeight: 500, fontSize: '0.75rem' }}>
                        {formatDate(day.dateKey)}
                        {state.prepDays.includes(day.weekday) ? ' · prep day' : ''}
                      </div>
                    </th>
                    <td>
                      <Seg
                        label={`Training on ${WEEKDAY_LONG[day.weekday]}`}
                        value={day.dayType}
                        onChange={(id) => setType(day, id)}
                        options={typeOptions}
                      />
                    </td>
                    {['breakfast', 'lunch', 'snack', 'dinner'].map((k) => {
                      const meal = get(k)
                      return (
                        <td key={k}>
                          {meal ? (
                            <>
                              <div>{meal.title}</div>
                              <div className="dim tnum" style={{ fontSize: '0.75rem' }}>
                                {round(meal.actual.kcal)} kcal · {round(meal.actual.protein)} g protein
                              </div>
                              {k === 'dinner' && shake && (
                                <div className="chip chip--accent" style={{ marginTop: 6 }}>
                                  + shake {round(shake.actual.kcal)} kcal
                                </div>
                              )}
                            </>
                          ) : (
                            <span className="dim">—</span>
                          )}
                        </td>
                      )
                    })}
                    <td className="tnum">
                      <b>{round(day.totals.kcal)}</b>
                      <div className="dim" style={{ fontSize: '0.75rem' }}>
                        {round(day.totals.protein)} P · {round(day.totals.carbs)} C · {round(day.totals.fat)} F
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="week-cards">
          {days.map((day) => {
            const Ico = TYPE_ICON[day.dayType]
            return (
              <article
                key={day.dateKey}
                className={`card daycard${day.dateKey === today ? ' meal--now' : ''}`}
                aria-labelledby={`wk-${day.dateKey}`}
              >
                <div className="daycard__head">
                  <div>
                    <div className="daycard__day" id={`wk-${day.dateKey}`}>
                      {WEEKDAY_SHORT[day.weekday]} {formatDate(day.dateKey)}
                    </div>
                    <div className="dim" style={{ fontSize: '0.75rem' }}>
                      {day.templateName}
                      {state.prepDays.includes(day.weekday) ? ' · prep day' : ''}
                    </div>
                  </div>
                  <div className="row" style={{ gap: 6 }}>
                    <span className="chip">
                      <Ico size={13} />
                      {round(day.totals.kcal)} kcal
                    </span>
                  </div>
                </div>

                <Seg
                  label={`Training on ${WEEKDAY_LONG[day.weekday]}`}
                  value={day.dayType}
                  onChange={(id) => setType(day, id)}
                  options={typeOptions}
                />

                <ul className="daycard__list">
                  {day.meals.map((m) => (
                    <li key={m.key}>
                      <b className="tnum">{round(m.actual.kcal)}</b>
                      <span>{m.title}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className="btn btn--sm btn--block"
                  style={{ marginTop: 12 }}
                  onClick={() => onOpenDay(day.dateKey)}
                >
                  Open {WEEKDAY_LONG[day.weekday]}
                </button>
              </article>
            )
          })}
        </div>
      )}

      <Notice tone="info">
        Swapping ingredients happens on a day, not here — open a day to change what is in a meal.
        Training type is the only thing that changes the shape of the plan: on a strength day a shake
        is added and more of the day&apos;s carbs move to dinner.
      </Notice>
    </div>
  )
}
