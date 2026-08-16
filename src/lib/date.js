/** Date helpers. Everything is local-time and keyed by 'YYYY-MM-DD'. */

const pad = (n) => String(n).padStart(2, '0')

export function toKey(d) {
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
}

export function fromKey(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function todayKey() {
  return toKey(new Date())
}

export function addDays(key, n) {
  const d = fromKey(key)
  d.setDate(d.getDate() + n)
  return toKey(d)
}

export function weekdayOf(key) {
  return fromKey(key).getDay() // 0 = Sunday
}

/** Sunday-based week start — the prep cycle begins on Sunday. */
export function weekStart(key) {
  return addDays(key, -weekdayOf(key))
}

export function weekDays(startKey) {
  return Array.from({ length: 7 }, (_, i) => addDays(startKey, i))
}

/**
 * Weekday names come from the device locale, not a hardcoded English list —
 * otherwise a phone set to German shows "Sonntag, 16. August" from
 * toLocaleDateString right next to a hand-written "Sunday".
 * 2024-01-07 was a Sunday, so index 0 lines up with getDay().
 */
function weekdayNames(style) {
  const fmt = new Intl.DateTimeFormat(undefined, { weekday: style })
  return Array.from({ length: 7 }, (_, i) => fmt.format(new Date(2024, 0, 7 + i)))
}

export const WEEKDAY_LONG = weekdayNames('long')
export const WEEKDAY_SHORT = weekdayNames('short')

export function formatDate(key, opts = { month: 'short', day: 'numeric' }) {
  return fromKey(key).toLocaleDateString(undefined, opts)
}

export function formatLong(key) {
  return fromKey(key).toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' })
}

export function relativeDayLabel(key) {
  const today = todayKey()
  if (key === today) return 'Today'
  if (key === addDays(today, 1)) return 'Tomorrow'
  if (key === addDays(today, -1)) return 'Yesterday'
  return WEEKDAY_LONG[weekdayOf(key)]
}

/** 'HH:MM' → minutes since midnight. */
export function minutesOf(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number)
  return h * 60 + (m || 0)
}

export function formatTime(hhmm) {
  const [h, m] = String(hhmm).split(':').map(Number)
  const d = new Date()
  d.setHours(h, m || 0, 0, 0)
  return d.toLocaleTimeString(undefined, { hour: 'numeric', minute: '2-digit' })
}

export function nowMinutes() {
  const d = new Date()
  return d.getHours() * 60 + d.getMinutes()
}

/** "in 40 min" / "2h 10m ago" */
export function relativeMinutes(deltaMin) {
  const abs = Math.abs(deltaMin)
  const h = Math.floor(abs / 60)
  const m = abs % 60
  const body = h > 0 ? `${h}h${m ? ` ${m}m` : ''}` : `${m} min`
  return deltaMin >= 0 ? `in ${body}` : `${body} ago`
}

export function daysBetween(aKey, bKey) {
  return Math.round((fromKey(bKey) - fromKey(aKey)) / 86400000)
}
