/**
 * Sauces, as real recipes with real macros.
 *
 * Each is one serving, built from ingredients already in the database, so the
 * calories are calculated rather than guessed and they flow through to the
 * meal totals, the shopping list and the prep checklist like anything else.
 *
 * Salt, pepper and dried herbs are not modelled — at 1–3 g they are a rounding
 * error. Season them properly.
 *
 * To change a recipe, change the grams. Everything downstream follows.
 */

import { macrosFor, sumMacros, EMPTY_MACROS } from './ingredients.js'

export const SAUCES = [
  {
    id: 'none',
    name: 'No sauce',
    short: 'None',
    components: [],
    method: '',
    keeps: 0,
  },
  {
    id: 'tzatziki',
    name: 'Garlic yogurt with cucumber',
    short: 'Garlic yogurt',
    components: [
      { id: 'greek_yogurt_whole', grams: 90 },
      { id: 'cucumber', grams: 45 },
      { id: 'garlic', grams: 4 },
      { id: 'olive_oil', grams: 3 },
    ],
    method:
      'Grate the cucumber coarsely, salt it, leave it 10 minutes in a sieve and then squeeze it hard — this is the step that decides whether the sauce is thick or watery. Crush the garlic and let it sit 10 minutes. Stir everything into the yogurt with salt, pepper and the oil.',
    keeps: 4,
    goesWith: 'Chicken, turkey, beef, roast vegetables, potatoes',
  },
  {
    id: 'chimichurri',
    name: 'Chimichurri',
    short: 'Chimichurri',
    components: [
      { id: 'parsley', grams: 18 },
      { id: 'olive_oil', grams: 11 },
      { id: 'red_wine_vinegar', grams: 8 },
      { id: 'garlic', grams: 5 },
    ],
    method:
      'Chop the parsley and garlic by hand rather than blitzing them — a blender turns it into a bitter green paste. Stir in the vinegar, oil, dried oregano, chili flakes and plenty of salt. Leave it 30 minutes before eating.',
    keeps: 5,
    goesWith: 'Beef, chicken, salmon, potatoes',
  },
  {
    id: 'lemon_garlic_yogurt',
    name: 'Lemon garlic yogurt',
    short: 'Lemon yogurt',
    components: [
      { id: 'greek_yogurt_whole', grams: 90 },
      { id: 'lemon_juice', grams: 10 },
      { id: 'garlic', grams: 3 },
      { id: 'olive_oil', grams: 3 },
    ],
    method:
      'Crush the garlic into the yogurt with the lemon juice, oil, salt and pepper. Thinner and sharper than the cucumber version, and it takes about a minute.',
    keeps: 4,
    goesWith: 'Fish, shrimp, chicken, roast vegetables',
  },
  {
    id: 'salsa',
    name: 'Fresh tomato salsa',
    short: 'Tomato salsa',
    components: [
      { id: 'tomato', grams: 70 },
      { id: 'red_onion', grams: 18 },
      { id: 'parsley', grams: 8 },
      { id: 'lemon_juice', grams: 6 },
      { id: 'olive_oil', grams: 4 },
    ],
    method:
      'Dice everything small. Soak the onion in cold water for 10 minutes first to take the edge off. Mix with the lemon, oil and salt. Best on the day, still fine on the second.',
    keeps: 2,
    goesWith: 'Fish, shrimp, beef, eggs',
  },
  {
    id: 'mustard_vinaigrette',
    name: 'Mustard vinaigrette',
    short: 'Vinaigrette',
    components: [
      { id: 'olive_oil', grams: 10 },
      { id: 'red_wine_vinegar', grams: 9 },
      { id: 'dijon_mustard', grams: 7 },
    ],
    method:
      'Whisk the mustard and vinegar first, then add the oil slowly so it emulsifies and stays mixed. Shake it in a jar if you would rather not whisk. Keeps a week.',
    keeps: 7,
    goesWith: 'Salads, cold chicken, tuna, green beans',
  },
  {
    id: 'parmesan_yogurt',
    name: 'Parmesan garlic yogurt',
    short: 'Parmesan yogurt',
    components: [
      { id: 'greek_yogurt_whole', grams: 80 },
      { id: 'parmesan', grams: 9 },
      { id: 'garlic', grams: 3 },
      { id: 'lemon_juice', grams: 5 },
    ],
    method:
      'Grate the parmesan finely so it disappears into the yogurt. Crush the garlic, add the lemon, season. Thick enough to sit on a plate rather than run off it.',
    keeps: 4,
    goesWith: 'Beef, chicken, roast vegetables, potatoes',
  },
]

export const SAUCE_BY_ID = Object.fromEntries(SAUCES.map((s) => [s.id, s]))

/** Macros for one serving of a sauce. */
export function sauceMacros(id) {
  const sauce = SAUCE_BY_ID[id]
  if (!sauce || !sauce.components.length) return EMPTY_MACROS
  return sumMacros(sauce.components.map((c) => macrosFor(c.id, c.grams)))
}

/** Sauces that use nothing you have hidden in settings. */
export function availableSauces(hiddenIds) {
  const hidden = hiddenIds instanceof Set ? hiddenIds : new Set(hiddenIds)
  return SAUCES.filter((s) => !s.components.some((c) => hidden.has(c.id)))
}
