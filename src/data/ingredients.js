/**
 * Ingredient database — 50 items, macros per 100g of the listed state.
 * Source: USDA FoodData Central typical values, as supplied in the build spec.
 *
 * Fields added on top of the spec table (all clearly approximate, all editable here):
 *   fiber      g per 100g — USDA typical. The plan leans on fiber for satiety,
 *              so it is worth showing even though the spec table omitted it.
 *   rawFactor  multiply the eaten (cooked) amount by this to get the amount to BUY.
 *              Covers cooking yield loss and inedible waste (peel, core, stems).
 *   shelfDays  days a cooked/prepped portion keeps in the fridge. Drives "eat by".
 *   piece      approximate edible grams of one common unit, where one exists.
 *
 * Branded items (granola, oat milk, whey) vary a lot — check your label and
 * adjust the numbers here once. This file is the single source of truth.
 */

export const CATEGORIES = {
  protein: { label: 'Protein', short: 'P', color: 'protein' },
  carb: { label: 'Carb', short: 'C', color: 'carb' },
  vegetable: { label: 'Vegetable', short: 'V', color: 'veg' },
  fruit: { label: 'Fruit', short: 'F', color: 'fruit' },
  fat: { label: 'Fat', short: 'Fa', color: 'fat' },
  liquid: { label: 'Liquid', short: 'L', color: 'liquid' },
}

/** @type {Array<{id:string,name:string,category:keyof typeof CATEGORIES,state:string,kcal:number,protein:number,fat:number,carbs:number,fiber:number,rawFactor:number,shelfDays?:number,piece?:number,note?:string}>} */
export const INGREDIENTS = [
  // ── Proteins ──────────────────────────────────────────────────────────────
  { id: 'chicken_breast', name: 'Chicken breast', category: 'protein', state: 'cooked', kcal: 165, protein: 31, fat: 3.6, carbs: 0, fiber: 0, rawFactor: 1.35, shelfDays: 4 },
  { id: 'ground_beef_90', name: 'Ground beef 90/10', category: 'protein', state: 'cooked', kcal: 220, protein: 26, fat: 12, carbs: 0, fiber: 0, rawFactor: 1.3, shelfDays: 4 },
  { id: 'cod', name: 'Cod', category: 'protein', state: 'cooked', kcal: 105, protein: 23, fat: 0.9, carbs: 0, fiber: 0, rawFactor: 1.3, shelfDays: 3 },
  { id: 'salmon', name: 'Salmon (Atlantic, farmed)', category: 'protein', state: 'cooked', kcal: 208, protein: 20, fat: 13, carbs: 0, fiber: 0, rawFactor: 1.25, shelfDays: 3 },
  { id: 'shrimp', name: 'Shrimp', category: 'protein', state: 'cooked', kcal: 99, protein: 24, fat: 0.3, carbs: 0.2, fiber: 0, rawFactor: 1.2, shelfDays: 3 },
  { id: 'turkey_breast', name: 'Turkey breast', category: 'protein', state: 'cooked', kcal: 135, protein: 30, fat: 1, carbs: 0, fiber: 0, rawFactor: 1.35, shelfDays: 4 },
  { id: 'tuna_canned', name: 'Tuna, canned in water', category: 'protein', state: 'drained', kcal: 116, protein: 26, fat: 0.8, carbs: 0, fiber: 0, rawFactor: 1, shelfDays: 2, piece: 120, note: 'Shelf-stable until opened' },
  { id: 'whole_egg', name: 'Whole egg', category: 'protein', state: 'cooked', kcal: 155, protein: 13, fat: 11, carbs: 1.1, fiber: 0, rawFactor: 1, shelfDays: 4, piece: 50 },
  { id: 'egg_white', name: 'Egg white', category: 'protein', state: 'cooked', kcal: 52, protein: 11, fat: 0.2, carbs: 0.7, fiber: 0, rawFactor: 1, shelfDays: 4, piece: 33 },
  { id: 'greek_yogurt', name: 'Greek yogurt, 0%', category: 'protein', state: 'as eaten', kcal: 59, protein: 10, fat: 0.4, carbs: 3.6, fiber: 0, rawFactor: 1, shelfDays: 7 },
  { id: 'cottage_cheese', name: 'Cottage cheese, low fat', category: 'protein', state: 'as eaten', kcal: 72, protein: 12, fat: 1, carbs: 3.4, fiber: 0, rawFactor: 1, shelfDays: 5 },
  { id: 'whey_isolate', name: 'Whey protein isolate', category: 'protein', state: 'powder', kcal: 375, protein: 80, fat: 2, carbs: 6, fiber: 0, rawFactor: 1, piece: 30, note: 'Check your tub — brands vary' },

  // ── Carbs / Starches ──────────────────────────────────────────────────────
  { id: 'brown_rice', name: 'Brown (full grain) rice', category: 'carb', state: 'cooked', kcal: 123, protein: 2.7, fat: 1, carbs: 26, fiber: 1.6, rawFactor: 0.36, shelfDays: 4, note: 'Buy amount is DRY rice' },
  { id: 'sweet_potato', name: 'Sweet potato', category: 'carb', state: 'cooked', kcal: 90, protein: 2, fat: 0.1, carbs: 21, fiber: 3.3, rawFactor: 1.15, shelfDays: 4 },
  { id: 'white_potato', name: 'White potato', category: 'carb', state: 'cooked', kcal: 87, protein: 1.9, fat: 0.1, carbs: 20, fiber: 1.8, rawFactor: 1.15, shelfDays: 4 },
  { id: 'oats', name: 'Oats', category: 'carb', state: 'dry', kcal: 389, protein: 17, fat: 7, carbs: 66, fiber: 10.6, rawFactor: 1, shelfDays: 5 },
  { id: 'quinoa', name: 'Quinoa', category: 'carb', state: 'cooked', kcal: 120, protein: 4.4, fat: 1.9, carbs: 21, fiber: 2.8, rawFactor: 0.35, shelfDays: 4, note: 'Buy amount is DRY quinoa' },
  { id: 'granola', name: 'Low carb granola', category: 'carb', state: 'check label', kcal: 450, protein: 15, fat: 30, carbs: 25, fiber: 12, rawFactor: 1, note: 'Brand varies a lot — check your label' },

  // ── Vegetables ────────────────────────────────────────────────────────────
  { id: 'zucchini', name: 'Zucchini', category: 'vegetable', state: 'raw', kcal: 17, protein: 1.2, fat: 0.3, carbs: 3.1, fiber: 1, rawFactor: 1.05, shelfDays: 4 },
  { id: 'bell_pepper', name: 'Bell pepper', category: 'vegetable', state: 'raw', kcal: 31, protein: 1, fat: 0.3, carbs: 6, fiber: 2, rawFactor: 1.2, shelfDays: 5 },
  { id: 'carrots', name: 'Carrots', category: 'vegetable', state: 'raw', kcal: 41, protein: 0.9, fat: 0.2, carbs: 10, fiber: 2.8, rawFactor: 1.15, shelfDays: 6 },
  { id: 'green_beans', name: 'Green beans', category: 'vegetable', state: 'raw', kcal: 31, protein: 1.8, fat: 0.2, carbs: 7, fiber: 3.4, rawFactor: 1.1, shelfDays: 4 },
  { id: 'green_onions', name: 'Green onions', category: 'vegetable', state: 'raw', kcal: 32, protein: 1.8, fat: 0.2, carbs: 7.3, fiber: 2.6, rawFactor: 1.2, shelfDays: 5 },
  { id: 'asparagus', name: 'Asparagus', category: 'vegetable', state: 'raw', kcal: 20, protein: 2.2, fat: 0.1, carbs: 3.9, fiber: 2.1, rawFactor: 1.4, shelfDays: 3 },
  { id: 'broccoli', name: 'Broccoli', category: 'vegetable', state: 'raw', kcal: 34, protein: 2.8, fat: 0.4, carbs: 7, fiber: 2.6, rawFactor: 1.25, shelfDays: 4 },
  { id: 'spinach', name: 'Spinach', category: 'vegetable', state: 'raw', kcal: 23, protein: 2.9, fat: 0.4, carbs: 3.6, fiber: 2.2, rawFactor: 1, shelfDays: 3 },
  { id: 'cucumber', name: 'Cucumber', category: 'vegetable', state: 'raw', kcal: 15, protein: 0.7, fat: 0.1, carbs: 3.6, fiber: 0.5, rawFactor: 1.1, shelfDays: 5 },
  { id: 'tomato', name: 'Tomato', category: 'vegetable', state: 'raw', kcal: 18, protein: 0.9, fat: 0.2, carbs: 3.9, fiber: 1.2, rawFactor: 1.05, shelfDays: 5 },
  { id: 'mushrooms', name: 'Mushrooms (white)', category: 'vegetable', state: 'raw', kcal: 22, protein: 3.1, fat: 0.3, carbs: 3.3, fiber: 1, rawFactor: 1.05, shelfDays: 4 },
  { id: 'cauliflower', name: 'Cauliflower', category: 'vegetable', state: 'raw', kcal: 25, protein: 1.9, fat: 0.3, carbs: 5, fiber: 2, rawFactor: 1.3, shelfDays: 5 },
  { id: 'kale', name: 'Kale', category: 'vegetable', state: 'raw', kcal: 49, protein: 4.3, fat: 0.9, carbs: 8.8, fiber: 3.6, rawFactor: 1.4, shelfDays: 4 },
  { id: 'red_onion', name: 'Red onion', category: 'vegetable', state: 'raw', kcal: 40, protein: 1.1, fat: 0.1, carbs: 9.3, fiber: 1.7, rawFactor: 1.15, shelfDays: 10 },
  { id: 'garlic', name: 'Garlic', category: 'vegetable', state: 'raw', kcal: 149, protein: 6.4, fat: 0.5, carbs: 33, fiber: 2.1, rawFactor: 1.1, shelfDays: 14, piece: 3 },
  { id: 'celery', name: 'Celery', category: 'vegetable', state: 'raw', kcal: 16, protein: 0.7, fat: 0.2, carbs: 3, fiber: 1.6, rawFactor: 1.1, shelfDays: 6 },
  { id: 'eggplant', name: 'Eggplant', category: 'vegetable', state: 'raw', kcal: 25, protein: 1, fat: 0.2, carbs: 6, fiber: 3, rawFactor: 1.1, shelfDays: 4 },

  // ── Fruits ────────────────────────────────────────────────────────────────
  { id: 'apple', name: 'Apple', category: 'fruit', state: 'raw', kcal: 52, protein: 0.3, fat: 0.2, carbs: 14, fiber: 2.4, rawFactor: 1.1, shelfDays: 10, piece: 165 },
  { id: 'blueberries', name: 'Blueberries', category: 'fruit', state: 'raw', kcal: 57, protein: 0.7, fat: 0.3, carbs: 14, fiber: 2.4, rawFactor: 1, shelfDays: 6 },
  { id: 'strawberries', name: 'Strawberries', category: 'fruit', state: 'raw', kcal: 32, protein: 0.7, fat: 0.3, carbs: 7.7, fiber: 2, rawFactor: 1.05, shelfDays: 4 },
  { id: 'raspberries', name: 'Raspberries', category: 'fruit', state: 'raw', kcal: 52, protein: 1.2, fat: 0.7, carbs: 12, fiber: 6.5, rawFactor: 1, shelfDays: 3 },
  { id: 'banana', name: 'Banana', category: 'fruit', state: 'raw', kcal: 89, protein: 1.1, fat: 0.3, carbs: 23, fiber: 2.6, rawFactor: 1.6, shelfDays: 5, piece: 118 },
  { id: 'orange', name: 'Orange', category: 'fruit', state: 'raw', kcal: 47, protein: 0.9, fat: 0.1, carbs: 12, fiber: 2.4, rawFactor: 1.35, shelfDays: 10, piece: 130 },
  { id: 'kiwi', name: 'Kiwi', category: 'fruit', state: 'raw', kcal: 61, protein: 1.1, fat: 0.5, carbs: 15, fiber: 3, rawFactor: 1.25, shelfDays: 8, piece: 75 },
  { id: 'pear', name: 'Pear', category: 'fruit', state: 'raw', kcal: 57, protein: 0.4, fat: 0.1, carbs: 15, fiber: 3.1, rawFactor: 1.1, shelfDays: 7, piece: 165 },

  // ── Fats / Dairy / Other ──────────────────────────────────────────────────
  { id: 'olive_oil', name: 'Olive oil', category: 'fat', state: '—', kcal: 884, protein: 0, fat: 100, carbs: 0, fiber: 0, rawFactor: 1, piece: 9, note: '1 tbsp ≈ 13 g' },
  { id: 'avocado', name: 'Avocado', category: 'fat', state: 'raw', kcal: 160, protein: 2, fat: 15, carbs: 8.5, fiber: 6.7, rawFactor: 1.4, shelfDays: 2, piece: 136 },
  { id: 'almonds', name: 'Almonds', category: 'fat', state: 'raw', kcal: 579, protein: 21, fat: 50, carbs: 22, fiber: 12.5, rawFactor: 1, piece: 1.2 },
  { id: 'peanut_butter', name: 'Peanut butter (natural)', category: 'fat', state: '—', kcal: 588, protein: 25, fat: 50, carbs: 20, fiber: 6, rawFactor: 1, piece: 16, note: '1 tbsp ≈ 16 g' },
  { id: 'chia_seeds', name: 'Chia seeds', category: 'fat', state: 'dry', kcal: 486, protein: 17, fat: 31, carbs: 42, fiber: 34.4, rawFactor: 1, piece: 12 },
  { id: 'parmesan', name: 'Parmesan cheese', category: 'fat', state: '—', kcal: 431, protein: 38, fat: 29, carbs: 4.1, fiber: 0, rawFactor: 1, shelfDays: 21 },
  { id: 'oat_milk', name: 'Oat milk, unsweetened', category: 'liquid', state: 'as eaten', kcal: 40, protein: 0.8, fat: 1.5, carbs: 6, fiber: 0.8, rawFactor: 1, shelfDays: 7, note: 'Brand varies — check your carton' },
]

export const BY_ID = Object.fromEntries(INGREDIENTS.map((i) => [i.id, i]))

export function getIngredient(id) {
  return BY_ID[id]
}

export function byCategory(category) {
  return INGREDIENTS.filter((i) => i.category === category)
}

/**
 * Name trimmed for use inside a dish title: drops the parenthetical and
 * anything after a comma. "Salmon (Atlantic, farmed)" → "Salmon",
 * "Greek yogurt, 0%" → "Greek yogurt".
 */
export function shortName(id) {
  const name = BY_ID[id]?.name
  if (!name) return ''
  return name
    .replace(/\s*\([^)]*\)\s*/g, ' ')
    .replace(/,.*$/, '')
    .trim()
}

/** Macros contributed by `grams` of an ingredient. */
export function macrosFor(id, grams) {
  const ing = BY_ID[id]
  if (!ing) return { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }
  const f = grams / 100
  return {
    kcal: ing.kcal * f,
    protein: ing.protein * f,
    fat: ing.fat * f,
    carbs: ing.carbs * f,
    fiber: ing.fiber * f,
  }
}

export const EMPTY_MACROS = { kcal: 0, protein: 0, fat: 0, carbs: 0, fiber: 0 }

export function addMacros(a, b) {
  return {
    kcal: a.kcal + b.kcal,
    protein: a.protein + b.protein,
    fat: a.fat + b.fat,
    carbs: a.carbs + b.carbs,
    fiber: a.fiber + b.fiber,
  }
}

export function sumMacros(list) {
  return list.reduce(addMacros, EMPTY_MACROS)
}
