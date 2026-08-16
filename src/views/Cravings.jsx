import { useMemo, useState } from 'react'
import { useDispatch, useStore } from '../state/store.jsx'
import { cravingStats } from '../lib/plan.js'
import { CRAVING_BACKGROUND, CRAVING_TAGS } from '../data/rationale.js'
import { Sheet } from '../components/Sheet.jsx'
import { Empty, Notice, Seg } from '../components/ui.jsx'
import { IconInfo, IconLog, IconTrash } from '../components/Icons.jsx'
import { formatTime } from '../lib/date.js'

const TAG = Object.fromEntries(CRAVING_TAGS.map((t) => [t.id, t]))

const dayKeyOf = (ts) => {
  const d = new Date(ts)
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

const timeOf = (ts) =>
  new Date(ts).toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })

const dateLabelOf = (ts) => {
  const d = new Date(ts)
  const today = new Date()
  const diff = Math.round((new Date(today.toDateString()) - new Date(d.toDateString())) / 86400000)
  if (diff === 0) return 'Today'
  if (diff === 1) return 'Yesterday'
  return d.toLocaleDateString(undefined, { weekday: 'long', month: 'short', day: 'numeric' })
}

export function CravingsView({ logOpen, setLogOpen }) {
  const state = useStore()
  const dispatch = useDispatch()
  const [windowDays, setWindowDays] = useState(14)
  const [about, setAbout] = useState(false)
  const [tag, setTag] = useState('stress')
  const [note, setNote] = useState('')

  const stats = useMemo(
    () => cravingStats(state.cravings, windowDays),
    [state.cravings, windowDays],
  )
  const maxTag = Math.max(1, ...stats.byTag.map(([, n]) => n))
  const maxHour = Math.max(1, ...stats.byHour)

  const grouped = useMemo(() => {
    const map = new Map()
    for (const c of state.cravings.slice(0, 120)) {
      const k = dayKeyOf(c.ts)
      if (!map.has(k)) map.set(k, [])
      map.get(k).push(c)
    }
    return [...map.entries()]
  }, [state.cravings])

  const submit = () => {
    dispatch({ type: 'addCraving', tag, note: note.trim() })
    setNote('')
    setLogOpen(false)
  }

  return (
    <div className="stack stack--lg">
      <div className="row row--between">
        <div>
          <h2 style={{ fontSize: '1.125rem' }}>Craving log</h2>
          <p className="dim" style={{ fontSize: '0.8125rem' }}>
            One tap. No judgement, no analysis — the point is the pattern.
          </p>
        </div>
        <button
          type="button"
          className="icon-btn"
          onClick={() => setAbout(true)}
          aria-label="Why this is logged rather than resisted"
        >
          <IconInfo />
        </button>
      </div>

      <button type="button" className="btn btn--primary btn--block" onClick={() => setLogOpen(true)}>
        <IconLog size={18} />
        Log a craving
      </button>

      <Seg
        label="Time window for the summary"
        value={String(windowDays)}
        onChange={(v) => setWindowDays(Number(v))}
        options={[
          { id: '7', label: '7 days' },
          { id: '14', label: '14 days' },
          { id: '30', label: '30 days' },
        ]}
      />

      {stats.total === 0 ? (
        <Empty icon={IconLog} title="Nothing logged in this window">
          After a couple of weeks the shape shows up on its own — which hours, which triggers. That
          is the whole point of logging it.
        </Empty>
      ) : (
        <>
          <div className="totals">
            <div className="stat">
              <div className="stat__label">Logged</div>
              <div className="stat__value tnum">{stats.total}</div>
              <div className="stat__sub">in {stats.windowDays} days</div>
            </div>
            <div className="stat">
              <div className="stat__label">Per day</div>
              <div className="stat__value tnum">{stats.perDay.toFixed(1)}</div>
              <div className="stat__sub">average</div>
            </div>
            <div className="stat">
              <div className="stat__label">Peak hour</div>
              <div className="stat__value tnum">
                {stats.peakHour == null ? '—' : `${String(stats.peakHour).padStart(2, '0')}:00`}
              </div>
              <div className="stat__sub">most common</div>
            </div>
            <div className="stat">
              <div className="stat__label">Top trigger</div>
              <div className="stat__value" style={{ fontSize: '1rem' }}>
                {stats.byTag[0] ? TAG[stats.byTag[0][0]]?.label || stats.byTag[0][0] : '—'}
              </div>
              <div className="stat__sub">{stats.byTag[0] ? `${stats.byTag[0][1]}×` : ''}</div>
            </div>
          </div>

          <section aria-labelledby="bytag-head">
            <div className="section-head">
              <h2 id="bytag-head">By trigger</h2>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div className="bars">
                {stats.byTag.map(([id, n]) => (
                  <div className="bar-row" key={id}>
                    <span>{TAG[id]?.label || id}</span>
                    <div
                      className="bar-track"
                      role="img"
                      aria-label={`${TAG[id]?.label || id}: ${n} of ${stats.total}`}
                    >
                      <div className="bar-fill" style={{ width: `${(n / maxTag) * 100}%` }} />
                    </div>
                    <span className="count">{n}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section aria-labelledby="byhour-head">
            <div className="section-head">
              <h2 id="byhour-head">By hour of day</h2>
              <span className="dim" style={{ fontSize: '0.75rem' }}>
                dinner {formatTime(state.schedule.dinner)} · bed {formatTime(state.schedule.bed)}
              </span>
            </div>
            <div className="card" style={{ padding: 14 }}>
              <div
                className="hours"
                role="img"
                aria-label={`Cravings by hour. Peak at ${stats.peakHour ?? 0} o'clock.`}
              >
                {stats.byHour.map((n, h) => (
                  <div
                    key={h}
                    className="hours__bar"
                    data-has={n > 0 ? 'true' : 'false'}
                    style={{ height: `${Math.max(4, (n / maxHour) * 100)}%` }}
                    title={`${String(h).padStart(2, '0')}:00 — ${n}`}
                  />
                ))}
              </div>
              <div className="hours__axis" aria-hidden="true">
                {Array.from({ length: 24 }, (_, h) => (
                  <span key={h}>{h % 6 === 0 ? h : ''}</span>
                ))}
              </div>
            </div>
          </section>
        </>
      )}

      {stats.byTag.some(([id]) => id === 'still_hungry') && (
        <Notice tone="info">
          <b>&ldquo;Still hungry&rdquo; is showing up.</b> That one points at the plan rather than at
          willpower — check whether the meal before it is running light, and swap it up.
        </Notice>
      )}

      <section aria-labelledby="history-head">
        <div className="section-head">
          <h2 id="history-head">History</h2>
          <span className="dim" style={{ fontSize: '0.75rem' }}>
            {state.cravings.length} total
          </span>
        </div>
        {grouped.length === 0 ? (
          <Empty icon={IconLog} title="Nothing logged yet">
            The button above takes two taps and no thought. That is the design.
          </Empty>
        ) : (
          <div className="card">
            {grouped.map(([key, items]) => (
              <div key={key}>
                <div
                  style={{
                    padding: '10px 14px 4px',
                    fontSize: '0.75rem',
                    fontWeight: 700,
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    color: 'var(--text-3)',
                  }}
                >
                  {dateLabelOf(items[0].ts)} · {items.length}
                </div>
                <ul className="list">
                  {items.map((c) => (
                    <li key={c.id} className="list__item" style={{ cursor: 'default' }}>
                      <span className="list__main">
                        <b>{TAG[c.tag]?.label || c.tag}</b>
                        {c.note && <span>{c.note}</span>}
                      </span>
                      <span className="dim tnum" style={{ fontSize: '0.8125rem' }}>
                        {timeOf(c.ts)}
                      </span>
                      <button
                        type="button"
                        className="icon-btn"
                        onClick={() => dispatch({ type: 'deleteCraving', id: c.id })}
                        aria-label={`Delete ${TAG[c.tag]?.label || c.tag} craving logged at ${timeOf(c.ts)}`}
                      >
                        <IconTrash size={17} />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Log sheet */}
      <Sheet
        open={logOpen}
        onClose={() => setLogOpen(false)}
        title="Log a craving"
        subtitle="Right now. Whatever it is."
        footer={
          <>
            <button type="button" className="btn" style={{ flex: 1 }} onClick={() => setLogOpen(false)}>
              Cancel
            </button>
            <button type="button" className="btn btn--primary" style={{ flex: 2 }} onClick={submit}>
              Log it
            </button>
          </>
        }
      >
        <div className="stack">
          <div className="option-list">
            {CRAVING_TAGS.map((t) => (
              <button
                key={t.id}
                type="button"
                className="option"
                aria-pressed={tag === t.id}
                onClick={() => setTag(t.id)}
              >
                <span className="option__main">
                  <b>{t.label}</b>
                  {t.hint && <span>{t.hint}</span>}
                </span>
              </button>
            ))}
          </div>
          <div className="field">
            <label htmlFor="craving-note">Note (optional)</label>
            <input
              id="craving-note"
              className="input"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Anything worth remembering"
              maxLength={120}
            />
          </div>
        </div>
      </Sheet>

      {/* Background */}
      <Sheet open={about} onClose={() => setAbout(false)} title={CRAVING_BACKGROUND.title}>
        <div className="stack">
          {CRAVING_BACKGROUND.body.map((p, i) => (
            <p key={i} style={{ lineHeight: 1.6, fontSize: '0.9375rem' }}>
              {p}
            </p>
          ))}
          <div className="section-head" style={{ marginTop: 4, marginBottom: 0 }}>
            <h2>What the evidence supports</h2>
          </div>
          <ul className="stack stack--sm">
            {CRAVING_BACKGROUND.levers.map((l, i) => (
              <li key={i} className="row" style={{ alignItems: 'flex-start', gap: 10 }}>
                <span
                  className="dot"
                  style={{ background: 'var(--accent)', marginTop: 8, flex: 'none' }}
                />
                <span style={{ fontSize: '0.9375rem', lineHeight: 1.5 }}>{l}</span>
              </li>
            ))}
          </ul>
        </div>
      </Sheet>
    </div>
  )
}
