/**
 * Portion solver.
 *
 * Turns "this meal needs 47 g protein, 100 g carbs, 30 g fat" plus a list of
 * chosen ingredients into actual gram amounts, in an order that mirrors how
 * a plate is actually built:
 *
 *   1. vegetables  — fixed volume. They are here for bulk and fiber, so they
 *                    are anchored to a portion size rather than fitted to macros.
 *   2. fruit       — fixed volume, same reasoning.
 *   3. liquid      — fixed volume (a shake is a shake).
 *   4. protein     — fitted to close the meal's protein target.
 *   5. carbs       — fitted to close what is left of the carb target.
 *   6. fat         — fitted last, absorbing whatever the protein source
 *                    already brought with it.
 *
 * Steps 4–6 run several times. Real ingredients are not single-macro: granola
 * sits in a carb slot but is 30% fat, quinoa carries protein. A single pass
 * fits protein before it knows what the carb slot will contribute, and the
 * meal ends up over on protein and fat. Re-running each pass against the
 * current amounts of every other slot settles that out in two or three rounds.
 *
 * Nothing is forced to land exactly on target. Each meal reports what it
 * actually delivers next to what it was aiming for, so a swap that pulls a
 * meal off target is visible instead of silently rebalanced.
 */

import { BY_ID, macrosFor, EMPTY_MACROS, addMacros } from '../data/ingredients.js'

const DENSE_KCAL = 350 // above this, round to 1 g instead of 5 g

function roundGrams(id, grams) {
  const ing = BY_ID[id]
  if (!ing) return 0
  if (ing.kcal >= DENSE_KCAL) return Math.max(0, Math.round(grams))
  return Math.max(0, Math.round(grams / 5) * 5)
}

function clamp(v, lo, hi) {
  return Math.min(hi, Math.max(lo, v))
}

/**
 * @param {Array} slots  template slots, each { role, category, id, base?, weight?, min?, max? }
 * @param {{protein:number,carbs:number,fat:number}} target  meal macro target in grams
 * @param {number} volumeFactor  scales the fixed-volume slots with the calorie target
 */
const FIT_PASSES = [
  { category: 'protein', macro: 'protein', floor: 25 },
  { category: 'carb', macro: 'carbs', floor: 15 },
  { category: 'fat', macro: 'fat', floor: 3 },
]

const ROUNDS = 3

/**
 * @param {object} extras  macros already committed to this meal from something
 *   that is not a slot — currently the sauce. Counted before protein, carbs
 *   and fat are fitted, so a 150 kcal sauce shrinks the plate rather than
 *   quietly adding itself on top of the day's target.
 */
export function solveMeal(slots, target, volumeFactor = 1, extras = EMPTY_MACROS) {
  const out = slots.map((s) => ({ ...s, grams: 0 }))

  // 1–3. Fixed-volume slots: set once and left alone.
  for (const slot of out) {
    if (slot.category === 'vegetable' || slot.category === 'fruit' || slot.category === 'liquid') {
      const base = slot.base ?? (slot.category === 'liquid' ? 250 : 150)
      const scaled = slot.category === 'liquid' ? base : base * volumeFactor
      slot.grams = roundGrams(slot.id, clamp(scaled, slot.min ?? 30, slot.max ?? 400))
    }
  }

  // 4–6. Fit each category against everything the other slots currently supply.
  const fitPass = ({ category, macro, floor }) => {
    const group = out.filter((s) => s.category === category)
    if (!group.length) return
    const fromOthers = out
      .filter((s) => s.category !== category)
      .reduce((acc, s) => addMacros(acc, macrosFor(s.id, s.grams)), extras)
    const remaining = target[macro] - fromOthers[macro]
    const totalWeight = group.reduce((n, s) => n + (s.weight ?? 1), 0)
    for (const slot of group) {
      const per100 = BY_ID[slot.id]?.[macro] ?? 0
      const share = ((slot.weight ?? 1) / totalWeight) * remaining
      // An ingredient carrying almost none of the macro it was picked for
      // (olive oil in a carb slot) would otherwise explode to a nonsense amount.
      const raw = per100 > 0.5 ? (share / per100) * 100 : (slot.base ?? floor)
      slot.grams = roundGrams(slot.id, clamp(raw, slot.min ?? floor, slot.max ?? 400))
    }
  }

  for (let round = 0; round < ROUNDS; round++) FIT_PASSES.forEach(fitPass)

  const totalOf = () => out.reduce((acc, s) => addMacros(acc, macrosFor(s.id, s.grams)), extras)
  let actual = totalOf()

  // Safety valve. An ingredient can be a poor fit for the macro its slot was
  // asked to carry — swap granola into a dinner carb slot and closing the carb
  // target alone would call for 400 g of it, three times the meal's calories.
  // Shave the carb slots back to a hard calorie ceiling and let the meal report
  // the resulting macro miss honestly rather than serve an absurd amount.
  const targetKcal = target.protein * 4 + target.carbs * 4 + target.fat * 9
  const ceiling = targetKcal * 1.1
  if (actual.kcal > ceiling) {
    const group = out.filter((s) => s.category === 'carb' && s.grams > (s.min ?? 15))
    const kcalPerGram = group.reduce((n, s) => n + (BY_ID[s.id]?.kcal ?? 0) / 100, 0)
    if (kcalPerGram > 0) {
      const cut = (actual.kcal - ceiling) / kcalPerGram
      for (const slot of group) {
        slot.grams = roundGrams(slot.id, Math.max(slot.min ?? 15, slot.grams - cut))
      }
      actual = totalOf()
    }
  }

  return { slots: out, actual }
}

/**
 * Amount to BUY for a given eaten amount, accounting for cooking yield and
 * inedible waste. Rice and quinoa go the other way — you buy less dry than
 * you eat cooked.
 */
export function rawAmount(id, cookedGrams) {
  const ing = BY_ID[id]
  if (!ing) return 0
  return cookedGrams * ing.rawFactor
}

/** A friendly secondary unit, where one exists ("≈ 2 eggs", "≈ 1 tbsp"). */
export function pieceHint(id, grams) {
  const ing = BY_ID[id]
  if (!ing?.piece || grams <= 0) return null
  const n = grams / ing.piece
  if (n < 0.4) return null
  const label = {
    whole_egg: n => `${fmtCount(n)} egg${n >= 1.5 ? 's' : ''}`,
    egg_white: n => `${fmtCount(n)} white${n >= 1.5 ? 's' : ''}`,
    banana: n => `${fmtCount(n)} banana${n >= 1.5 ? 's' : ''}`,
    apple: n => `${fmtCount(n)} apple${n >= 1.5 ? 's' : ''}`,
    orange: n => `${fmtCount(n)} orange${n >= 1.5 ? 's' : ''}`,
    kiwi: n => `${fmtCount(n)} kiwi`,
    pear: n => `${fmtCount(n)} pear${n >= 1.5 ? 's' : ''}`,
    avocado: n => `${fmtCount(n)} avocado`,
    garlic: n => `${fmtCount(n)} clove${n >= 1.5 ? 's' : ''}`,
    olive_oil: n => `${fmtCount(grams / 13)} tbsp`,
    peanut_butter: n => `${fmtCount(n)} tbsp`,
    chia_seeds: n => `${fmtCount(n)} tbsp`,
    whey_isolate: n => `${fmtCount(n)} scoop${n >= 1.5 ? 's' : ''}`,
    almonds: n => `${Math.round(n)} almonds`,
    tuna_canned: n => `${fmtCount(n)} can${n >= 1.5 ? 's' : ''}`,
  }[id]
  return label ? `≈ ${label(n)}` : null
}

function fmtCount(n) {
  const rounded = Math.max(0.5, Math.round(n * 2) / 2)
  if (rounded === 0.5) return '½'
  return Number.isInteger(rounded) ? String(rounded) : `${Math.floor(rounded)}½`
}
