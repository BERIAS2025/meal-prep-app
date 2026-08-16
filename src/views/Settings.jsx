import { useRef, useState } from 'react'
import { useDispatch, useStore, useTargets } from '../state/store.jsx'
import { ACTIVITY_LEVELS, GOALS, SEXES } from '../lib/nutrition.js'
import { INGREDIENTS, CATEGORIES, CATEGORY_ORDER } from '../data/ingredients.js'
import { exportState, importState } from '../lib/storage.js'
import { WEEKDAY_LONG, WEEKDAY_SHORT, formatTime, minutesOf } from '../lib/date.js'
import { cmToFtIn, ftInToCm, kgToLb, lbToKg, weightUnit } from '../lib/units.js'
import { Sheet } from '../components/Sheet.jsx'
import { Field, Notice, Seg, Stepper } from '../components/ui.jsx'
import { IconDownload, IconUpload } from '../components/Icons.jsx'

const SCHEDULE_FIELDS = [
  { key: 'cardio', label: 'Morning cardio' },
  { key: 'breakfast', label: 'Breakfast' },
  { key: 'lunch', label: 'Lunch' },
  { key: 'snack', label: 'Afternoon snack' },
  { key: 'strength', label: 'Strength session' },
  { key: 'shake', label: 'Post-training shake' },
  { key: 'dinner', label: 'Dinner' },
  { key: 'bed', label: 'Bed' },
]

export function SettingsView() {
  const state = useStore()
  const dispatch = useDispatch()
  const targets = useTargets()
  const [confirmReset, setConfirmReset] = useState(false)
  const [importMsg, setImportMsg] = useState(null)
  const fileRef = useRef(null)

  const p = state.profile
  const imperial = p.unitSystem === 'imperial'
  const setProfile = (patch) => dispatch({ type: 'profile', patch })
  const ftIn = cmToFtIn(p.heightCm)

  const dinnerToBedHours =
    Math.round((((minutesOf(state.schedule.bed) - minutesOf(state.schedule.dinner) + 1440) % 1440) / 60) * 10) / 10

  const doExport = () => {
    const blob = new Blob([exportState(state)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `meal-plan-backup-${new Date().toISOString().slice(0, 10)}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const doImport = async (file) => {
    try {
      const text = await file.text()
      dispatch({ type: 'hydrate', state: importState(text) })
      setImportMsg({ tone: 'info', text: 'Backup restored.' })
    } catch (err) {
      setImportMsg({ tone: 'alert', text: err.message || 'Could not read that file.' })
    }
  }

  return (
    <div className="stack stack--lg">
      {/* ── Body ─────────────────────────────────────────────────────────── */}
      <section aria-labelledby="body-head">
        <div className="section-head">
          <h2 id="body-head">Your numbers</h2>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div className="stack">
            <Seg
              label="Units"
              value={p.unitSystem}
              onChange={(unitSystem) => setProfile({ unitSystem })}
              options={[
                { id: 'metric', label: 'kg / cm' },
                { id: 'imperial', label: 'lb / ft' },
              ]}
            />

            <div className="field-row">
              <Field label="Sex" htmlFor="sex" hint="Used by the BMR equation">
                <select
                  id="sex"
                  className="select"
                  value={p.sex}
                  onChange={(e) => setProfile({ sex: e.target.value })}
                >
                  {SEXES.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </Field>
              <Field label="Age" htmlFor="age">
                <div className="input-group">
                  <input
                    id="age"
                    className="input"
                    type="number"
                    inputMode="numeric"
                    min={14}
                    max={100}
                    value={p.age}
                    onChange={(e) => setProfile({ age: Number(e.target.value) || 0 })}
                  />
                  <span className="input-group__unit">years</span>
                </div>
              </Field>
            </div>

            <div className="field-row">
              <Field label="Weight" htmlFor="weight">
                <div className="input-group">
                  <input
                    id="weight"
                    className="input"
                    type="number"
                    inputMode="decimal"
                    step={imperial ? 1 : 0.1}
                    value={imperial ? Math.round(kgToLb(p.weightKg)) : Math.round(p.weightKg * 10) / 10}
                    onChange={(e) => {
                      const v = Number(e.target.value) || 0
                      setProfile({ weightKg: imperial ? lbToKg(v) : v })
                    }}
                  />
                  <span className="input-group__unit">{weightUnit(p.unitSystem)}</span>
                </div>
              </Field>
              {imperial ? (
                <Field label="Height" htmlFor="height-ft">
                  <div className="input-group">
                    <input
                      id="height-ft"
                      className="input"
                      type="number"
                      inputMode="numeric"
                      value={ftIn.ft}
                      aria-label="Height, feet"
                      onChange={(e) => setProfile({ heightCm: ftInToCm(e.target.value, ftIn.in) })}
                    />
                    <span className="input-group__unit">ft</span>
                    <input
                      className="input"
                      type="number"
                      inputMode="numeric"
                      value={ftIn.in}
                      aria-label="Height, inches"
                      style={{ borderRadius: 0, borderLeft: 'none' }}
                      onChange={(e) => setProfile({ heightCm: ftInToCm(ftIn.ft, e.target.value) })}
                    />
                    <span className="input-group__unit">in</span>
                  </div>
                </Field>
              ) : (
                <Field label="Height" htmlFor="height">
                  <div className="input-group">
                    <input
                      id="height"
                      className="input"
                      type="number"
                      inputMode="numeric"
                      value={Math.round(p.heightCm)}
                      onChange={(e) => setProfile({ heightCm: Number(e.target.value) || 0 })}
                    />
                    <span className="input-group__unit">cm</span>
                  </div>
                </Field>
              )}
            </div>

            <Field
              label="Body fat (optional)"
              htmlFor="bodyfat"
              hint="If you know it, the calculation switches to Katch-McArdle, which is more accurate at the extremes."
            >
              <div className="input-group">
                <input
                  id="bodyfat"
                  className="input"
                  type="number"
                  inputMode="decimal"
                  min={3}
                  max={60}
                  placeholder="—"
                  value={p.bodyFatPct ?? ''}
                  onChange={(e) =>
                    setProfile({ bodyFatPct: e.target.value === '' ? null : Number(e.target.value) })
                  }
                />
                <span className="input-group__unit">%</span>
              </div>
            </Field>
          </div>
        </div>
      </section>

      {/* ── Activity & goal ──────────────────────────────────────────────── */}
      <section aria-labelledby="goal-head">
        <div className="section-head">
          <h2 id="goal-head">Activity and goal</h2>
        </div>
        <div className="card">
          <div style={{ padding: 14, borderBottom: '1px solid var(--border)' }}>
            <div className="field">
              <label htmlFor="activity">Activity level</label>
              <select
                id="activity"
                className="select"
                value={p.activityLevel}
                onChange={(e) => setProfile({ activityLevel: e.target.value })}
              >
                {ACTIVITY_LEVELS.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.label} — {a.desc}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <ul className="option-list" style={{ padding: 14 }}>
            {GOALS.map((g) => (
              <li key={g.id}>
                <button
                  type="button"
                  className="option"
                  aria-pressed={p.goal === g.id && !targets.isManual}
                  onClick={() => setProfile({ goal: g.id, manualCalories: null })}
                >
                  <span className="option__main">
                    <b>{g.label}</b>
                    <span>{g.desc}</span>
                  </span>
                  <span className="option__side">
                    {Math.round(targets.tdee * (1 + g.adjust))} kcal
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ── Result ───────────────────────────────────────────────────────── */}
      <section aria-labelledby="target-head">
        <div className="section-head">
          <h2 id="target-head">Daily target</h2>
        </div>
        <div className="result-card stack">
          <div>
            <div className="result-card__kcal">{targets.kcal}</div>
            <div className="muted" style={{ fontWeight: 650 }}>
              kcal per day{targets.isManual ? ' · set by hand' : ''}
            </div>
          </div>
          <div className="breakdown">
            <div className="breakdown__row">
              <span>BMR ({targets.bmrMethod})</span>
              <b>{targets.bmr} kcal</b>
            </div>
            <div className="breakdown__row">
              <span>× activity {targets.activityFactor}</span>
              <b>{targets.tdee} kcal</b>
            </div>
            <div className="breakdown__row">
              <span>
                {targets.goalAdjust === 0
                  ? 'Maintenance'
                  : `${Math.round(targets.goalAdjust * 100)}% goal adjustment`}
              </span>
              <b>{targets.suggested} kcal</b>
            </div>
            <div className="breakdown__row breakdown__row--total">
              <span>Protein · Carbs · Fat</span>
              <b>
                {targets.protein} · {targets.carbs} · {targets.fat} g
              </b>
            </div>
          </div>
        </div>

        {targets.clampedToBMR && (
          <div style={{ marginTop: 12 }}>
            <Notice tone="alert">
              Your target was below your BMR, so it has been raised to {targets.bmr} kcal. Planning
              below resting expenditure is the pattern that most reliably produces evening bingeing.
            </Notice>
          </div>
        )}

        <div className="card" style={{ padding: 14, marginTop: 12 }}>
          <div className="stack">
            <Field
              label="Override the calorie target"
              htmlFor="manual-kcal"
              hint="Leave empty to use the calculated number above. Set it when the scale tells you something the equation does not."
            >
              <div className="input-group">
                <input
                  id="manual-kcal"
                  className="input"
                  type="number"
                  inputMode="numeric"
                  placeholder={String(targets.suggested)}
                  value={p.manualCalories ?? ''}
                  onChange={(e) =>
                    setProfile({
                      manualCalories: e.target.value === '' ? null : Number(e.target.value),
                    })
                  }
                />
                <span className="input-group__unit">kcal</span>
              </div>
            </Field>

            <Field
              label={`Protein: ${p.proteinPerKg} g per kg (${targets.protein} g/day)`}
              htmlFor="protein-kg"
            >
              <input
                id="protein-kg"
                className="input"
                type="range"
                min={1.4}
                max={2.6}
                step={0.1}
                value={p.proteinPerKg}
                onChange={(e) => setProfile({ proteinPerKg: Number(e.target.value) })}
              />
            </Field>

            <Field label={`Fat: ${p.fatPerKg} g per kg (${targets.fat} g/day)`} htmlFor="fat-kg">
              <input
                id="fat-kg"
                className="input"
                type="range"
                min={0.5}
                max={1.2}
                step={0.05}
                value={p.fatPerKg}
                onChange={(e) => setProfile({ fatPerKg: Number(e.target.value) })}
              />
            </Field>
          </div>
        </div>

        <p className="dim" style={{ fontSize: '0.75rem', marginTop: 10, lineHeight: 1.5 }}>
          These are estimates from standard equations, not measurements. Real expenditure varies by
          roughly ±10% between people with identical stats. Treat the number as a starting point and
          adjust it against the scale over two to three weeks. Not medical advice.
        </p>
      </section>

      {/* ── Schedule ─────────────────────────────────────────────────────── */}
      <section aria-labelledby="schedule-head">
        <div className="section-head">
          <h2 id="schedule-head">Daily rhythm</h2>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <div className="field-row" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))' }}>
            {SCHEDULE_FIELDS.map((f) => (
              <Field key={f.key} label={f.label} htmlFor={`time-${f.key}`}>
                <input
                  id={`time-${f.key}`}
                  className="input"
                  type="time"
                  value={state.schedule[f.key]}
                  onChange={(e) => dispatch({ type: 'schedule', patch: { [f.key]: e.target.value } })}
                />
              </Field>
            ))}
          </div>
          <p className="dim" style={{ fontSize: '0.75rem', marginTop: 12, lineHeight: 1.5 }}>
            Dinner currently starts about {dinnerToBedHours} hours before bed. The plan aims for 3 to
            4 between finishing dinner and sleeping.
          </p>
        </div>
      </section>

      {/* ── Prep ─────────────────────────────────────────────────────────── */}
      <section aria-labelledby="prep-days-head">
        <div className="section-head">
          <h2 id="prep-days-head">Prep and portions</h2>
        </div>
        <div className="card">
          <div className="setting">
            <div className="setting__main">
              <b>Prep days</b>
              <span>Days you cook ahead. Each one covers up to the next.</span>
            </div>
          </div>
          <div style={{ padding: '0 14px 14px' }}>
            <div className="pill-grid">
              {WEEKDAY_SHORT.map((short, idx) => (
                <button
                  key={idx}
                  type="button"
                  className="pill"
                  aria-label={WEEKDAY_LONG[idx]}
                  aria-pressed={state.prepDays.includes(idx)}
                  onClick={() =>
                    dispatch({
                      type: 'prepDays',
                      prepDays: state.prepDays.includes(idx)
                        ? state.prepDays.filter((d) => d !== idx)
                        : [...state.prepDays, idx],
                    })
                  }
                >
                  {short}
                </button>
              ))}
            </div>
          </div>
          <div className="setting">
            <div className="setting__main">
              <b>Portions per meal</b>
              <span>Scales the shopping list and prep amounts, not your plan.</span>
            </div>
            <Stepper
              value={state.portions}
              onChange={(portions) => dispatch({ type: 'portions', portions })}
              label="portions"
            />
          </div>
        </div>
      </section>

      {/* ── Appearance ───────────────────────────────────────────────────── */}
      <section aria-labelledby="appearance-head">
        <div className="section-head">
          <h2 id="appearance-head">Appearance</h2>
        </div>
        <div className="card" style={{ padding: 14 }}>
          <Seg
            label="Theme"
            value={state.theme}
            onChange={(theme) => dispatch({ type: 'theme', theme })}
            options={[
              { id: 'auto', label: 'Match phone' },
              { id: 'light', label: 'Light' },
              { id: 'dark', label: 'Dark' },
            ]}
          />
        </div>
      </section>

      {/* ── Ingredients ──────────────────────────────────────────────────── */}
      <section aria-labelledby="ing-head">
        <div className="section-head">
          <h2 id="ing-head">Ingredients you eat</h2>
          <span className="dim" style={{ fontSize: '0.75rem' }}>
            {state.hidden.length} turned off
          </span>
        </div>
        <p className="dim" style={{ fontSize: '0.8125rem', marginBottom: 10 }}>
          Switch off anything you do not eat or do not have. It is removed from your plan
          straight away — the closest alternative in the same group takes its place — and it stops
          appearing in swap lists, the shopping list and sauces. A swap you made by hand is left
          alone.
        </p>
        <div className="card" style={{ padding: 14 }}>
          <div className="stack">
            {CATEGORY_ORDER.map((cat) => (
              <div key={cat}>
                <div className="section-head" style={{ marginBottom: 6 }}>
                  <h2>{CATEGORIES[cat].label}</h2>
                </div>
                <div className="pill-grid">
                  {INGREDIENTS.filter((i) => i.category === cat).map((i) => {
                    const hidden = state.hidden.includes(i.id)
                    return (
                      <button
                        key={i.id}
                        type="button"
                        className="pill"
                        aria-pressed={!hidden}
                        style={{ textAlign: 'left', opacity: hidden ? 0.55 : 1 }}
                        onClick={() => dispatch({ type: 'hidden', ingredientId: i.id })}
                      >
                        {i.name}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Data ─────────────────────────────────────────────────────────── */}
      <section aria-labelledby="data-head">
        <div className="section-head">
          <h2 id="data-head">Your data</h2>
        </div>
        <Notice tone="info">
          Everything lives on this device only — no account, no server, nothing leaves the phone.
          That also means clearing the browser&apos;s site data wipes it. Export a backup now and
          then.
        </Notice>
        <div className="row row--wrap" style={{ marginTop: 12 }}>
          <button type="button" className="btn" onClick={doExport}>
            <IconDownload size={17} />
            Export backup
          </button>
          <button type="button" className="btn" onClick={() => fileRef.current?.click()}>
            <IconUpload size={17} />
            Restore backup
          </button>
          <input
            ref={fileRef}
            type="file"
            accept="application/json,.json"
            className="sr-only"
            aria-label="Choose a backup file"
            onChange={(e) => {
              const f = e.target.files?.[0]
              if (f) doImport(f)
              e.target.value = ''
            }}
          />
          <button type="button" className="btn btn--danger" onClick={() => setConfirmReset(true)}>
            Reset everything
          </button>
        </div>
        {importMsg && (
          <div style={{ marginTop: 12 }} aria-live="polite">
            <Notice tone={importMsg.tone}>{importMsg.text}</Notice>
          </div>
        )}
      </section>

      <p className="dim" style={{ fontSize: '0.75rem', textAlign: 'center', lineHeight: 1.6 }}>
        Nutrition values are USDA-typical figures per 100 g. Branded items — granola, oat milk, whey
        — vary by product; check the label and adjust them once in the ingredient file.
        <br />
        Meal times: {SCHEDULE_FIELDS.slice(0, 4).map((f) => formatTime(state.schedule[f.key])).join(' · ')}
      </p>

      <Sheet
        open={confirmReset}
        onClose={() => setConfirmReset(false)}
        title="Reset everything?"
        subtitle="This clears your profile, swaps, craving log, prep ticks and fridge list on this device."
        footer={
          <>
            <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setConfirmReset(false)}>
              Cancel
            </button>
            <button
              type="button"
              className="btn btn--danger"
              style={{ flex: 1 }}
              onClick={() => {
                dispatch({ type: 'reset' })
                setConfirmReset(false)
              }}
            >
              Reset
            </button>
          </>
        }
      >
        <p style={{ lineHeight: 1.6 }}>
          There is no undo. If you might want any of it back, export a backup first — the button is
          right above the one you just pressed.
        </p>
      </Sheet>
    </div>
  )
}
