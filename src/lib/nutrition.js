/**
 * Energy and macro targets.
 *
 * These are estimates from standard equations, not measurements. Real
 * expenditure varies by roughly +/- 10% between people with identical stats.
 * Treat the number as a starting point and adjust it against the scale over
 * two to three weeks.
 */

export const SEXES = [
  { id: 'male', label: 'Male' },
  { id: 'female', label: 'Female' },
]

export const ACTIVITY_LEVELS = [
  { id: 'sedentary', factor: 1.2, label: 'Sedentary', desc: 'Desk job, little or no exercise' },
  { id: 'light', factor: 1.375, label: 'Light', desc: 'Light exercise 1–3 days per week' },
  { id: 'moderate', factor: 1.55, label: 'Moderate', desc: 'Moderate exercise 3–5 days per week' },
  { id: 'high', factor: 1.725, label: 'High', desc: 'Hard exercise 6–7 days per week' },
  { id: 'athlete', factor: 1.9, label: 'Very high', desc: 'Hard daily training plus a physical job' },
]

export const GOALS = [
  { id: 'aggressive', adjust: -0.25, label: 'Aggressive', desc: 'Fastest loss. Hardest to hold, highest craving risk.' },
  { id: 'moderate', adjust: -0.18, label: 'Moderate', desc: 'Steady loss with meals that still carry volume.' },
  { id: 'slow', adjust: -0.1, label: 'Slow', desc: 'Gentle loss. Easiest to sustain long term.' },
  { id: 'maintain', adjust: 0, label: 'Maintenance', desc: 'Hold current weight.' },
]

export const DAY_TYPES = [
  { id: 'rest', label: 'Rest', short: 'Rest', desc: 'No training' },
  { id: 'cardio', label: 'Cardio only', short: 'Cardio', desc: 'Morning cardio, no strength work' },
  { id: 'strength', label: 'Strength', short: 'Strength', desc: 'Morning cardio plus strength session' },
]

export const EXTRA_ACTIVITIES = [
  { id: 'yoga', label: 'Yoga' },
  { id: 'walk', label: 'Walk' },
  { id: 'mobility', label: 'Flexibility' },
]

const byId = (list, id) => list.find((x) => x.id === id) || list[0]

/**
 * Basal metabolic rate.
 * Uses Katch-McArdle when body fat is known (more accurate at the extremes),
 * otherwise Mifflin-St Jeor, which is the current general-purpose default.
 */
export function calcBMR(profile) {
  const { sex, age, heightCm, weightKg, bodyFatPct } = profile
  if (bodyFatPct != null && bodyFatPct > 3 && bodyFatPct < 60) {
    const leanKg = weightKg * (1 - bodyFatPct / 100)
    return { value: 370 + 21.6 * leanKg, method: 'Katch-McArdle' }
  }
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return { value: sex === 'female' ? base - 161 : base + 5, method: 'Mifflin-St Jeor' }
}

/** Full target derivation: BMR → TDEE → goal-adjusted calories → macros. */
export function calcTargets(profile) {
  const bmr = calcBMR(profile)
  const activity = byId(ACTIVITY_LEVELS, profile.activityLevel)
  const goal = byId(GOALS, profile.goal)
  const tdee = bmr.value * activity.factor

  const fromGoal = tdee * (1 + goal.adjust)
  const manual = profile.manualCalories
  const requested = manual != null && manual > 0 ? manual : fromGoal

  // Never plan a day below BMR. Undereating early is the single most reliable
  // predictor of an evening binge, which is the exact failure mode this plan
  // is built to avoid.
  const floor = Math.round(bmr.value)
  const clamped = requested < floor
  const kcal = Math.round(clamped ? floor : requested)

  const protein = Math.round(profile.proteinPerKg * profile.weightKg)
  const fat = Math.round(profile.fatPerKg * profile.weightKg)
  const carbs = Math.max(0, Math.round((kcal - protein * 4 - fat * 9) / 4))

  return {
    bmr: Math.round(bmr.value),
    bmrMethod: bmr.method,
    tdee: Math.round(tdee),
    activityFactor: activity.factor,
    goalAdjust: goal.adjust,
    suggested: Math.round(fromGoal),
    isManual: manual != null && manual > 0,
    clampedToBMR: clamped,
    kcal,
    protein,
    fat,
    carbs,
    fiberTarget: Math.max(25, Math.round((kcal / 1000) * 14)), // 14 g per 1000 kcal
  }
}

/**
 * Share of each macro that lands in each meal slot, by day type.
 * Every column sums to 1.00.
 *
 * The shape of these numbers is the plan's actual logic:
 *   · lunch carries the highest protein share and a deliberately low carb share
 *   · dinner carries about half the day's carbs, more on strength days
 *   · the shake exists to close the protein gap, not to fuel anything
 */
export const MEAL_SPLITS = {
  strength: {
    breakfast: { protein: 0.18, carbs: 0.18, fat: 0.2 },
    lunch: { protein: 0.3, carbs: 0.17, fat: 0.28 },
    snack: { protein: 0.12, carbs: 0.15, fat: 0.1 },
    shake: { protein: 0.15, carbs: 0.1, fat: 0.03 },
    dinner: { protein: 0.25, carbs: 0.4, fat: 0.39 },
  },
  cardio: {
    breakfast: { protein: 0.2, carbs: 0.21, fat: 0.22 },
    lunch: { protein: 0.33, carbs: 0.2, fat: 0.3 },
    snack: { protein: 0.15, carbs: 0.17, fat: 0.1 },
    dinner: { protein: 0.32, carbs: 0.42, fat: 0.38 },
  },
  rest: {
    breakfast: { protein: 0.2, carbs: 0.22, fat: 0.22 },
    lunch: { protein: 0.33, carbs: 0.21, fat: 0.3 },
    snack: { protein: 0.15, carbs: 0.18, fat: 0.1 },
    dinner: { protein: 0.32, carbs: 0.39, fat: 0.38 },
  },
}

export const MEAL_ORDER = ['breakfast', 'lunch', 'snack', 'shake', 'dinner']

export const MEAL_LABELS = {
  breakfast: 'Breakfast',
  lunch: 'Lunch',
  snack: 'Afternoon snack',
  shake: 'Post-training shake',
  dinner: 'Dinner',
}

/** Which meal slots exist on a given day type, in time order. */
export function mealsForDayType(dayType) {
  const split = MEAL_SPLITS[dayType] || MEAL_SPLITS.cardio
  return MEAL_ORDER.filter((m) => split[m])
}

/** Absolute macro grams for one meal slot on a given day. */
export function mealTargets(dayType, meal, targets) {
  const split = (MEAL_SPLITS[dayType] || MEAL_SPLITS.cardio)[meal]
  if (!split) return null
  const protein = targets.protein * split.protein
  const carbs = targets.carbs * split.carbs
  const fat = targets.fat * split.fat
  return { protein, carbs, fat, kcal: protein * 4 + carbs * 4 + fat * 9 }
}

export const kcalOf = (m) => m.protein * 4 + m.carbs * 4 + m.fat * 9
