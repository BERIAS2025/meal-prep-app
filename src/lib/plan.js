/**
 * Derived plan data. Views read from here; nothing in here mutates state.
 */

import { WEEK_TEMPLATES, MEAL_TIME_KEY } from '../data/templates.js'
import { RATIONALE, STRENGTH_DINNER_NOTE } from '../data/rationale.js'
import { MEAL_LABELS, mealsForDayType, mealTargets } from './nutrition.js'
import { solveMeal, rawAmount } from './solver.js'
import { BY_ID, macrosFor, EMPTY_MACROS, addMacros, shortName } from '../data/ingredients.js'
import { weekdayOf, weekDays, addDays, minutesOf, daysBetween, WEEKDAY_SHORT } from './date.js'

const clamp = (v, lo, hi) => Math.min(hi, Math.max(lo, v))

/** Minimum sensible calories per meal — the "don't let a meal run empty" rule. */
const MEAL_FLOOR = { breakfast: 250, lunch: 300, snack: 150, shake: 100, dinner: 350 }

/**
 * Once a meal has been swapped its template title is a lie — "Salmon, sweet
 * potato & green beans" after the sweet potato became rice. Rebuild the title
 * from what is actually on the plate: the protein, the starch, then the first
 * vegetable or fruit.
 */
function deriveTitle(slots) {
  const pick = (cat) => slots.find((s) => s.category === cat && s.grams > 0)
  const parts = [pick('protein'), pick('carb'), pick('vegetable') || pick('fruit')]
    .filter(Boolean)
    .map((s) => shortName(s.id))
  if (parts.length < 2) return parts[0] || ''
  // Only the first item keeps its capital, matching the hand-written titles.
  const lower = (s) => (s.startsWith('Greek') ? s : s.charAt(0).toLowerCase() + s.slice(1))
  const [first, ...rest] = parts.map((p, i) => (i === 0 ? p : lower(p)))
  return `${first}${rest.length > 1 ? `, ${rest.slice(0, -1).join(', ')}` : ''} & ${rest[rest.length - 1]}`
}

export function dayTypeFor(state, dateKey) {
  const override = state.dayOverrides[dateKey]?.dayType
  return override || state.weekTypes[weekdayOf(dateKey)] || 'cardio'
}

export function buildDay(state, targets, dateKey) {
  const weekday = weekdayOf(dateKey)
  const template = WEEK_TEMPLATES[weekday]
  const dayType = dayTypeFor(state, dateKey)
  const override = state.dayOverrides[dateKey] || {}
  const swaps = override.swaps || {}
  const done = override.done || {}
  const volumeFactor = clamp(targets.kcal / 2200, 0.7, 1.4)

  const meals = mealsForDayType(dayType).map((mealKey) => {
    const tpl = template.meals[mealKey]
    const slots = tpl.slots.map((s) => {
      const swapped = swaps[`${mealKey}.${s.role}`]
      return swapped && BY_ID[swapped] ? { ...s, id: swapped, swapped: true } : { ...s }
    })
    const target = mealTargets(dayType, mealKey, targets)
    const solved = solveMeal(slots, target, volumeFactor)
    const time = state.schedule[MEAL_TIME_KEY[mealKey]]

    let why = RATIONALE[mealKey].line
    if (mealKey === 'dinner' && dayType === 'strength') why = `${why} ${STRENGTH_DINNER_NOTE}`

    const swapped = slots.some((s) => s.swapped)

    return {
      key: mealKey,
      label: MEAL_LABELS[mealKey],
      title: swapped ? deriveTitle(solved.slots) || tpl.title : tpl.title,
      time,
      minutes: minutesOf(time),
      slots: solved.slots,
      actual: solved.actual,
      target,
      why,
      detail: RATIONALE[mealKey].detail,
      done: !!done[mealKey],
      isLow: solved.actual.kcal < (MEAL_FLOOR[mealKey] || 200),
      hasSwap: swapped,
    }
  })

  const totals = meals.reduce((acc, m) => addMacros(acc, m.actual), EMPTY_MACROS)
  const eaten = meals.filter((m) => m.done).reduce((acc, m) => addMacros(acc, m.actual), EMPTY_MACROS)

  const dinner = meals.find((m) => m.key === 'dinner')
  const bedMin = minutesOf(state.schedule.bed)
  const rawGap = dinner ? bedMin - dinner.minutes : null
  const dinnerToBed = rawGap == null ? null : rawGap < 0 ? rawGap + 24 * 60 : rawGap

  return {
    dateKey,
    weekday,
    dayType,
    templateName: template.name,
    meals,
    totals,
    eaten,
    extras: override.extras || [],
    dinnerToBed,
    sleepStatus: dinnerToBed == null ? null : dinnerToBed < 180 ? 'tight' : dinnerToBed > 300 ? 'wide' : 'ok',
    hasSwaps: Object.keys(swaps).length > 0,
  }
}

export function buildWeek(state, targets, weekStartKey) {
  return weekDays(weekStartKey).map((k) => buildDay(state, targets, k))
}

/** Which meal slot is happening now, and what comes next. */
export function currentMeal(day, nowMin) {
  if (!day.meals.length) return { current: null, next: null }
  const WINDOW = 75 // a meal counts as "now" for this long after its time
  let current = null
  let next = null
  for (const m of day.meals) {
    if (nowMin >= m.minutes && nowMin < m.minutes + WINDOW) current = m
    if (nowMin < m.minutes && !next) next = m
  }
  if (!current && !next) return { current: null, next: null, dayOver: true }
  return { current, next: next || null }
}

// ── Shopping list ───────────────────────────────────────────────────────────

export function buildShoppingList(state, targets, weekStartKey) {
  const days = buildWeek(state, targets, weekStartKey)
  const totals = new Map()

  for (const day of days) {
    for (const meal of day.meals) {
      for (const slot of meal.slots) {
        if (!slot.grams) continue
        const prev = totals.get(slot.id) || { eaten: 0, days: new Set() }
        prev.eaten += slot.grams
        prev.days.add(WEEKDAY_SHORT[day.weekday])
        totals.set(slot.id, prev)
      }
    }
  }

  const portions = state.portions || 1
  const items = [...totals.entries()]
    .map(([id, v]) => {
      const ing = BY_ID[id]
      const eaten = v.eaten * portions
      return {
        id,
        name: ing.name,
        category: ing.category,
        eatenG: Math.round(eaten),
        buyG: Math.round(rawAmount(id, eaten)),
        buyNote: ing.rawFactor < 1 ? 'dry weight' : ing.rawFactor > 1.02 ? 'raw / untrimmed' : null,
        note: ing.note,
        usedOn: [...v.days],
      }
    })
    .sort((a, b) => a.name.localeCompare(b.name))

  const order = ['protein', 'carb', 'vegetable', 'fruit', 'fat', 'liquid']
  const groups = order
    .map((cat) => ({ category: cat, items: items.filter((i) => i.category === cat) }))
    .filter((g) => g.items.length)

  return { groups, items, dayCount: days.length, portions }
}

// ── Prep day checklist ──────────────────────────────────────────────────────

/** Prep days as date keys inside the given week. */
export function prepDayKeys(state, weekStartKey) {
  return weekDays(weekStartKey).filter((k) => state.prepDays.includes(weekdayOf(k)))
}

/**
 * Which dates a given prep day is responsible for: from that day up to (but
 * not including) the next prep day, wrapping to the end of the week.
 */
export function prepCoverage(state, weekStartKey, prepKey) {
  const all = prepDayKeys(state, weekStartKey)
  const idx = all.indexOf(prepKey)
  if (idx === -1) return [prepKey]
  const nextKey = all[idx + 1]
  const end = nextKey ? daysBetween(prepKey, nextKey) : 7 - daysBetween(weekStartKey, prepKey)
  return Array.from({ length: Math.max(1, end) }, (_, i) => addDays(prepKey, i))
}

/**
 * Ingredient states that are worth handling on a prep day: cooked ahead,
 * boiled from dry, or chopped raw. Anything "as eaten", "drained" or "powder"
 * is scooped from a tub or opened from a can on the day and would only add
 * noise to the checklist.
 */
const PREPPABLE_STATES = new Set(['cooked', 'dry', 'raw'])

/** Cook-ahead tasks for one prep day, with an eat-by date per item. */
export function buildPrepTasks(state, targets, weekStartKey, prepKey) {
  const covered = prepCoverage(state, weekStartKey, prepKey)
  const portions = state.portions || 1
  const agg = new Map()

  for (const dateKey of covered) {
    const day = buildDay(state, targets, dateKey)
    for (const meal of day.meals) {
      for (const slot of meal.slots) {
        const ing = BY_ID[slot.id]
        if (!ing?.shelfDays || !slot.grams) continue
        if (!PREPPABLE_STATES.has(ing.state)) continue
        // Fresh fruit and oils are assembled on the day, never prepped ahead.
        if (ing.category === 'fruit' || ing.category === 'fat' || ing.category === 'liquid') continue
        const prev = agg.get(slot.id) || { eaten: 0, dates: [] }
        prev.eaten += slot.grams * portions
        prev.dates.push(dateKey)
        agg.set(slot.id, prev)
      }
    }
  }

  const lastCovered = covered[covered.length - 1]

  const tasks = [...agg.entries()]
    .map(([id, v]) => {
      const ing = BY_ID[id]
      const spanDays = Math.min(ing.shelfDays, covered.length)
      const eatBy = addDays(prepKey, spanDays - 1)
      const shortfall = daysBetween(eatBy, lastCovered)
      return {
        id: `${prepKey}:${id}`,
        ingredientId: id,
        name: ing.name,
        category: ing.category,
        eatenG: Math.round(v.eaten),
        buyG: Math.round(rawAmount(id, v.eaten)),
        rawLabel: ing.rawFactor < 1 ? 'dry' : ing.rawFactor > 1.02 ? 'raw' : null,
        servings: v.dates.length,
        eatBy,
        shelfDays: ing.shelfDays,
        // Positive means the fridge life runs out before the window does.
        shortfallDays: shortfall > 0 ? shortfall : 0,
      }
    })
    .sort((a, b) => {
      const order = ['protein', 'carb', 'vegetable']
      return order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name)
    })

  return { prepKey, covered, tasks, portions }
}

// ── Craving stats ───────────────────────────────────────────────────────────

export function cravingStats(cravings, days = 14) {
  const cutoff = Date.now() - days * 86400000
  const recent = cravings.filter((c) => c.ts >= cutoff)
  const byTag = new Map()
  const byHour = Array(24).fill(0)
  const byDay = new Map()

  for (const c of recent) {
    byTag.set(c.tag, (byTag.get(c.tag) || 0) + 1)
    const d = new Date(c.ts)
    byHour[d.getHours()] += 1
    const key = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    byDay.set(key, (byDay.get(key) || 0) + 1)
  }

  const peakHour = byHour.indexOf(Math.max(...byHour))
  return {
    total: recent.length,
    perDay: recent.length / days,
    byTag: [...byTag.entries()].sort((a, b) => b[1] - a[1]),
    byHour,
    byDay,
    peakHour: Math.max(...byHour) > 0 ? peakHour : null,
    windowDays: days,
  }
}

export { macrosFor }
