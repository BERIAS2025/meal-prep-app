import { useEffect, useMemo, useState } from 'react'
import { useDispatch, useStore, useTargets } from '../state/store.jsx'
import { buildDay, currentMeal } from '../lib/plan.js'
import { DAY_TYPES, EXTRA_ACTIVITIES } from '../lib/nutrition.js'
import { DAY_TYPE_NOTE, SLEEP_RULE } from '../data/rationale.js'
import {
  addDays,
  formatTime,
  nowMinutes,
  relativeDayLabel,
  relativeMinutes,
  todayKey,
  formatLong,
  WEEKDAY_LONG,
} from '../lib/date.js'
import { MealCard } from '../components/MealCard.jsx'
import { SwapSheet } from '../components/SwapSheet.jsx'
import { Sheet } from '../components/Sheet.jsx'
import { Meter, Notice, Seg, Stat, round } from '../components/ui.jsx'
import { IconChevronLeft, IconChevronRight, IconClock } from '../components/Icons.jsx'

export function TodayView({ dateKey, setDateKey }) {
  const state = useStore()
  const dispatch = useDispatch()
  const targets = useTargets()
  const [minute, setMinute] = useState(nowMinutes())
  const [swapping, setSwapping] = useState(null)
  const [info, setInfo] = useState(null)

  // The hero needs to move on its own as the day passes.
  useEffect(() => {
    const t = setInterval(() => setMinute(nowMinutes()), 60000)
    return () => clearInterval(t)
  }, [])

  const day = useMemo(() => buildDay(state, targets, dateKey), [state, targets, dateKey])
  const isToday = dateKey === todayKey()
  const { current, next } = useMemo(
    () => (isToday ? currentMeal(day, minute) : { current: null, next: day.meals[0] || null }),
    [day, minute, isToday],
  )

  const hero = current || next
  const volumeFactor = Math.min(1.4, Math.max(0.7, targets.kcal / 2200))
  const remaining = Math.max(0, targets.kcal - day.eaten.kcal)

  return (
    <div className="stack stack--lg">
      {/* Date navigation */}
      <div className="row row--between">
        <button
          type="button"
          className="icon-btn"
          onClick={() => setDateKey(addDays(dateKey, -1))}
          aria-label="Previous day"
        >
          <IconChevronLeft />
        </button>
        <div style={{ textAlign: 'center', flex: 1, minWidth: 0 }}>
          <div style={{ fontWeight: 700, letterSpacing: '-0.01em' }}>{relativeDayLabel(dateKey)}</div>
          <div className="dim" style={{ fontSize: '0.8125rem' }}>
            {formatLong(dateKey)} · {day.templateName}
          </div>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setDateKey(addDays(dateKey, 1))}
          aria-label="Next day"
        >
          <IconChevronRight />
        </button>
      </div>

      {!isToday && (
        <button type="button" className="btn btn--sm" onClick={() => setDateKey(todayKey())}>
          Back to today
        </button>
      )}

      {/* Now / next */}
      <section className="hero" aria-labelledby="hero-title">
        <p className="hero__eyebrow">
          {current ? <span className="pulse" /> : <IconClock size={14} />}
          {current ? 'Eating now' : next ? 'Up next' : 'Day complete'}
        </p>
        <h2 className="hero__title" id="hero-title">
          {hero ? hero.title : 'Everything planned is done'}
        </h2>
        <p className="hero__meta">
          {hero ? (
            <>
              {hero.label} · {formatTime(hero.time)}
              {isToday && !current && ` · ${relativeMinutes(hero.minutes - minute)}`} ·{' '}
              <span className="tnum">{round(hero.actual.kcal)} kcal</span>
            </>
          ) : (
            `${round(day.eaten.kcal)} kcal logged today`
          )}
        </p>
        {hero && <p className="hero__meta" style={{ marginTop: 8 }}>{hero.why}</p>}
      </section>

      {/* Day type */}
      <section aria-labelledby="daytype-head">
        <div className="section-head">
          <h2 id="daytype-head">Training today</h2>
          {state.dayOverrides[dateKey]?.dayType && (
            <button
              type="button"
              className="link-btn"
              onClick={() => dispatch({ type: 'clearDayType', dateKey })}
            >
              Use the usual {WEEKDAY_LONG[day.weekday]}
            </button>
          )}
        </div>
        <Seg
          label="Training type for this day"
          value={day.dayType}
          onChange={(id) => dispatch({ type: 'dayType', dateKey, dayType: id })}
          options={DAY_TYPES.map((d) => ({ id: d.id, label: d.short, title: d.desc }))}
        />
        <p className="dim" style={{ fontSize: '0.8125rem', marginTop: 8 }}>
          {DAY_TYPE_NOTE[day.dayType]}
        </p>
        <div className="row row--wrap" style={{ marginTop: 10 }}>
          <span className="dim" style={{ fontSize: '0.75rem', fontWeight: 650 }}>
            Also today:
          </span>
          {EXTRA_ACTIVITIES.map((e) => (
            <button
              key={e.id}
              type="button"
              className="pill"
              style={{ minWidth: 84 }}
              aria-pressed={day.extras.includes(e.id)}
              onClick={() => dispatch({ type: 'extra', dateKey, extra: e.id })}
            >
              {e.label}
            </button>
          ))}
        </div>
      </section>

      {/* Totals */}
      <section aria-labelledby="totals-head">
        <div className="section-head">
          <h2 id="totals-head">Day total</h2>
          <span className="dim tnum" style={{ fontSize: '0.8125rem' }}>
            {isToday ? `${round(remaining)} kcal left` : `target ${targets.kcal} kcal`}
          </span>
        </div>
        <div className="totals">
          <Stat
            label="Calories"
            value={round(day.totals.kcal)}
            unit={`/ ${targets.kcal}`}
            sub={`${round(day.eaten.kcal)} eaten`}
            meter={<Meter value={day.eaten.kcal} max={targets.kcal} label="Calories eaten" over={day.eaten.kcal > targets.kcal} />}
          />
          <Stat
            label="Protein"
            dotColor="protein"
            value={round(day.totals.protein)}
            unit={`/ ${targets.protein} g`}
            sub={`${round(day.eaten.protein)} g eaten`}
            meter={<Meter value={day.eaten.protein} max={targets.protein} label="Protein eaten" />}
          />
          <Stat
            label="Carbs"
            dotColor="carb"
            value={round(day.totals.carbs)}
            unit={`/ ${targets.carbs} g`}
          />
          <Stat label="Fat" dotColor="fat" value={round(day.totals.fat)} unit={`/ ${targets.fat} g`} />
          <Stat
            label="Fiber"
            value={round(day.totals.fiber)}
            unit={`/ ${targets.fiberTarget} g`}
            sub={day.totals.fiber >= targets.fiberTarget ? 'on target' : 'below target'}
          />
        </div>
      </section>

      {day.sleepStatus === 'tight' && (
        <Notice tone="warn">
          <b>Dinner is {Math.round(day.dinnerToBed / 60)}h before bed.</b> {SLEEP_RULE.tight}
        </Notice>
      )}
      {day.meals.some((m) => m.isLow) && (
        <Notice tone="warn">
          <b>One meal is running light.</b> Undereating earlier in the day is one of the most reliable
          predictors of an evening binge — consider swapping up rather than riding it out.
        </Notice>
      )}
      {targets.clampedToBMR && (
        <Notice tone="alert">
          <b>Target raised to your BMR ({targets.bmr} kcal).</b> The number you set was below what your
          body burns at rest. Adjust it in Settings if this was deliberate.
        </Notice>
      )}

      {/* Meals */}
      <section aria-labelledby="meals-head">
        <div className="section-head">
          <h2 id="meals-head">The plan</h2>
          {day.hasSwaps && (
            <button
              type="button"
              className="link-btn"
              onClick={() => dispatch({ type: 'resetSwaps', dateKey })}
            >
              Undo all swaps
            </button>
          )}
        </div>
        <div className="meals">
          {day.meals.map((meal) => (
            <MealCard
              key={meal.key}
              meal={meal}
              isNow={isToday && current?.key === meal.key}
              onSwap={(m, slot) => setSwapping({ meal: m, slot })}
              onToggleDone={(m) => dispatch({ type: 'mealDone', dateKey, meal: m.key })}
              onInfo={setInfo}
            />
          ))}
        </div>
      </section>

      <SwapSheet
        open={!!swapping}
        onClose={() => setSwapping(null)}
        meal={swapping?.meal}
        slot={swapping?.slot}
        hidden={state.hidden}
        volumeFactor={volumeFactor}
        onPick={(ingredientId) => {
          dispatch({
            type: 'swap',
            dateKey,
            meal: swapping.meal.key,
            role: swapping.slot.role,
            ingredientId,
          })
          setSwapping(null)
        }}
        onReset={() => {
          dispatch({ type: 'resetSwaps', dateKey, meal: swapping.meal.key })
          setSwapping(null)
        }}
      />

      <Sheet
        open={!!info}
        onClose={() => setInfo(null)}
        title={info ? `Why ${info.label.toLowerCase()} sits here` : ''}
        subtitle={info ? formatTime(info.time) : ''}
      >
        <div className="stack">
          <p style={{ lineHeight: 1.6 }}>{info?.detail}</p>
          <div className="card card--flat" style={{ padding: 14 }}>
            <div className="section-head" style={{ marginBottom: 6 }}>
              <h2>This meal aims for</h2>
            </div>
            <div className="breakdown">
              <div className="breakdown__row">
                <span>Protein</span>
                <b>
                  {round(info?.actual.protein)} g <span className="dim">of {round(info?.target.protein)} g</span>
                </b>
              </div>
              <div className="breakdown__row">
                <span>Carbs</span>
                <b>
                  {round(info?.actual.carbs)} g <span className="dim">of {round(info?.target.carbs)} g</span>
                </b>
              </div>
              <div className="breakdown__row">
                <span>Fat</span>
                <b>
                  {round(info?.actual.fat)} g <span className="dim">of {round(info?.target.fat)} g</span>
                </b>
              </div>
              <div className="breakdown__row breakdown__row--total">
                <span>Calories</span>
                <b>
                  {round(info?.actual.kcal)} <span className="dim">of {round(info?.target.kcal)}</span>
                </b>
              </div>
            </div>
          </div>
          <p className="dim" style={{ fontSize: '0.8125rem', lineHeight: 1.5 }}>
            Amounts are solved to hit the protein target first, then carbs, then fat. Vegetables and
            fruit are held at a fixed portion for volume and fiber rather than fitted to macros, so
            they stay a real serving instead of shrinking when the target drops.
          </p>
        </div>
      </Sheet>
    </div>
  )
}
