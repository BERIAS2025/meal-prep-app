import { useMemo, useState } from 'react'
import { useDispatch, useStore } from '../state/store.jsx'
import { ACTIVITY_LEVELS, GOALS, SEXES, calcTargets } from '../lib/nutrition.js'
import { cmToFtIn, ftInToCm, kgToLb, lbToKg, weightUnit } from '../lib/units.js'
import { Field, Notice, Seg } from '../components/ui.jsx'
import { IconBowl } from '../components/Icons.jsx'

const STEPS = ['Welcome', 'Your numbers', 'Activity', 'Goal']

export function Onboarding() {
  const state = useStore()
  const dispatch = useDispatch()
  const [step, setStep] = useState(0)
  const [draft, setDraft] = useState(state.profile)

  const set = (patch) => setDraft((d) => ({ ...d, ...patch }))
  const imperial = draft.unitSystem === 'imperial'
  const ftIn = cmToFtIn(draft.heightCm)
  const targets = useMemo(() => calcTargets(draft), [draft])

  const valid =
    draft.age >= 14 && draft.age <= 100 && draft.heightCm > 100 && draft.weightKg > 30

  return (
    <div className="onboard">
      <div className="onboard__inner stack stack--lg">
        <div className="onboard__steps" role="progressbar" aria-valuenow={step + 1} aria-valuemin={1} aria-valuemax={STEPS.length} aria-label={`Setup step ${step + 1} of ${STEPS.length}: ${STEPS[step]}`}>
          {STEPS.map((s, i) => (
            <span
              key={s}
              className="onboard__step"
              data-state={i < step ? 'done' : i === step ? 'current' : 'todo'}
            />
          ))}
        </div>

        {step === 0 && (
          <div className="stack stack--lg">
            <div className="row" style={{ gap: 12 }}>
              <span
                style={{
                  display: 'inline-flex',
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                  background: 'var(--accent)',
                  color: 'var(--on-accent)',
                }}
              >
                <IconBowl size={28} />
              </span>
              <div>
                <h1 style={{ fontSize: '1.5rem' }}>Your meal plan</h1>
                <p className="muted">Set up once. Two minutes.</p>
              </div>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div className="stack">
                <p style={{ lineHeight: 1.6 }}>
                  This tells you what to eat, when, in what amount, and why that timing was chosen.
                  It works fully offline and keeps everything on this device.
                </p>
                <ul className="stack stack--sm">
                  {[
                    'One screen answers "what do I eat right now"',
                    'Swap any ingredient — the amounts re-solve themselves',
                    'Prep lists, shopping lists and eat-by dates come out of the plan',
                    'A craving log that just counts, so the pattern becomes visible',
                  ].map((t) => (
                    <li key={t} className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
                      <span className="dot" style={{ background: 'var(--accent)', marginTop: 8 }} />
                      <span style={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>{t}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <button type="button" className="btn btn--primary btn--block" onClick={() => setStep(1)}>
              Get started
            </button>
          </div>
        )}

        {step === 1 && (
          <div className="stack stack--lg">
            <div>
              <h1 style={{ fontSize: '1.375rem' }}>Your numbers</h1>
              <p className="muted">These set the calorie and protein targets everything scales from.</p>
            </div>

            <div className="card" style={{ padding: 16 }}>
              <div className="stack">
                <Seg
                  label="Units"
                  value={draft.unitSystem}
                  onChange={(unitSystem) => set({ unitSystem })}
                  options={[
                    { id: 'metric', label: 'kg / cm' },
                    { id: 'imperial', label: 'lb / ft' },
                  ]}
                />

                <div className="field-row">
                  <Field label="Sex" htmlFor="ob-sex" hint="Used by the BMR equation">
                    <select
                      id="ob-sex"
                      className="select"
                      value={draft.sex}
                      onChange={(e) => set({ sex: e.target.value })}
                    >
                      {SEXES.map((s) => (
                        <option key={s.id} value={s.id}>
                          {s.label}
                        </option>
                      ))}
                    </select>
                  </Field>
                  <Field label="Age" htmlFor="ob-age">
                    <div className="input-group">
                      <input
                        id="ob-age"
                        className="input"
                        type="number"
                        inputMode="numeric"
                        value={draft.age}
                        onChange={(e) => set({ age: Number(e.target.value) || 0 })}
                      />
                      <span className="input-group__unit">yrs</span>
                    </div>
                  </Field>
                </div>

                <div className="field-row">
                  <Field label="Weight" htmlFor="ob-weight">
                    <div className="input-group">
                      <input
                        id="ob-weight"
                        className="input"
                        type="number"
                        inputMode="decimal"
                        step={imperial ? 1 : 0.1}
                        value={
                          imperial ? Math.round(kgToLb(draft.weightKg)) : Math.round(draft.weightKg * 10) / 10
                        }
                        onChange={(e) => {
                          const v = Number(e.target.value) || 0
                          set({ weightKg: imperial ? lbToKg(v) : v })
                        }}
                      />
                      <span className="input-group__unit">{weightUnit(draft.unitSystem)}</span>
                    </div>
                  </Field>

                  {imperial ? (
                    <Field label="Height" htmlFor="ob-ft">
                      <div className="input-group">
                        <input
                          id="ob-ft"
                          className="input"
                          type="number"
                          inputMode="numeric"
                          aria-label="Height, feet"
                          value={ftIn.ft}
                          onChange={(e) => set({ heightCm: ftInToCm(e.target.value, ftIn.in) })}
                        />
                        <span className="input-group__unit">ft</span>
                        <input
                          className="input"
                          type="number"
                          inputMode="numeric"
                          aria-label="Height, inches"
                          style={{ borderRadius: 0, borderLeft: 'none' }}
                          value={ftIn.in}
                          onChange={(e) => set({ heightCm: ftInToCm(ftIn.ft, e.target.value) })}
                        />
                        <span className="input-group__unit">in</span>
                      </div>
                    </Field>
                  ) : (
                    <Field label="Height" htmlFor="ob-height">
                      <div className="input-group">
                        <input
                          id="ob-height"
                          className="input"
                          type="number"
                          inputMode="numeric"
                          value={Math.round(draft.heightCm)}
                          onChange={(e) => set({ heightCm: Number(e.target.value) || 0 })}
                        />
                        <span className="input-group__unit">cm</span>
                      </div>
                    </Field>
                  )}
                </div>

                <Field
                  label="Body fat (optional)"
                  htmlFor="ob-bf"
                  hint="If you know it, the calculation gets more accurate. Skip it otherwise."
                >
                  <div className="input-group">
                    <input
                      id="ob-bf"
                      className="input"
                      type="number"
                      inputMode="decimal"
                      placeholder="—"
                      value={draft.bodyFatPct ?? ''}
                      onChange={(e) =>
                        set({ bodyFatPct: e.target.value === '' ? null : Number(e.target.value) })
                      }
                    />
                    <span className="input-group__unit">%</span>
                  </div>
                </Field>
              </div>
            </div>

            {!valid && <Notice tone="warn">Fill in age, height and weight to continue.</Notice>}

            <div className="row">
              <button type="button" className="btn" onClick={() => setStep(0)}>
                Back
              </button>
              <button
                type="button"
                className="btn btn--primary"
                style={{ flex: 1 }}
                disabled={!valid}
                onClick={() => setStep(2)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 2 && (
          <div className="stack stack--lg">
            <div>
              <h1 style={{ fontSize: '1.375rem' }}>How active are you?</h1>
              <p className="muted">
                Count everything — training, walking, work. Daily cardio plus strength sessions is
                usually &ldquo;High&rdquo;.
              </p>
            </div>

            <ul className="option-list">
              {ACTIVITY_LEVELS.map((a) => (
                <li key={a.id}>
                  <button
                    type="button"
                    className="option"
                    aria-pressed={draft.activityLevel === a.id}
                    onClick={() => set({ activityLevel: a.id })}
                  >
                    <span className="option__main">
                      <b>{a.label}</b>
                      <span>{a.desc}</span>
                    </span>
                    <span className="option__side">
                      {Math.round(calcTargets({ ...draft, activityLevel: a.id, goal: 'maintain', manualCalories: null }).kcal)}{' '}
                      kcal
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="row">
              <button type="button" className="btn" onClick={() => setStep(1)}>
                Back
              </button>
              <button
                type="button"
                className="btn btn--primary"
                style={{ flex: 1 }}
                onClick={() => setStep(3)}
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="stack stack--lg">
            <div>
              <h1 style={{ fontSize: '1.375rem' }}>Pick a pace</h1>
              <p className="muted">Changeable any time in Settings — this is not a commitment.</p>
            </div>

            <ul className="option-list">
              {GOALS.map((g) => (
                <li key={g.id}>
                  <button
                    type="button"
                    className="option"
                    aria-pressed={draft.goal === g.id}
                    onClick={() => set({ goal: g.id, manualCalories: null })}
                  >
                    <span className="option__main">
                      <b>{g.label}</b>
                      <span>{g.desc}</span>
                    </span>
                    <span className="option__side">
                      <b style={{ fontSize: '1rem' }}>
                        {calcTargets({ ...draft, goal: g.id, manualCalories: null }).kcal}
                      </b>
                      <br />
                      <span style={{ fontSize: '0.6875rem', color: 'var(--text-3)' }}>kcal/day</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>

            <div className="result-card stack">
              <div>
                <div className="result-card__kcal">{targets.kcal}</div>
                <div className="muted" style={{ fontWeight: 650 }}>
                  kcal per day
                </div>
              </div>
              <div className="breakdown">
                <div className="breakdown__row">
                  <span>BMR ({targets.bmrMethod})</span>
                  <b>{targets.bmr}</b>
                </div>
                <div className="breakdown__row">
                  <span>Daily burn (TDEE)</span>
                  <b>{targets.tdee}</b>
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
              <Notice tone="warn">
                That pace lands below your resting burn, so the target has been held at {targets.bmr}{' '}
                kcal. Eating under BMR is the pattern most likely to end in an evening binge.
              </Notice>
            )}

            <p className="dim" style={{ fontSize: '0.75rem', lineHeight: 1.5 }}>
              An estimate from a standard equation, not a measurement. Adjust it against the scale
              after two to three weeks. Not medical advice.
            </p>

            <div className="row">
              <button type="button" className="btn" onClick={() => setStep(2)}>
                Back
              </button>
              <button
                type="button"
                className="btn btn--primary"
                style={{ flex: 1 }}
                onClick={() => dispatch({ type: 'onboarded', patch: draft })}
              >
                Open my plan
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
