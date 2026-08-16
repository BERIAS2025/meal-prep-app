/**
 * Seven day templates, indexed by weekday (0 = Sunday).
 *
 * A template only picks WHICH ingredients fill each slot. The amounts are
 * solved at render time against that day's macro targets, so changing the
 * calorie target or swapping an ingredient re-scales everything immediately.
 *
 * Every day carries a shake template even though it only appears on strength
 * days — flipping a day to Strength has to produce a shake with no gaps.
 *
 * Slot shape: { role, category, id, base?, weight?, min?, max? }
 *   role     stable key used to store swaps for that position
 *   base     starting grams for fixed-volume slots (vegetables, fruit, liquid)
 *   weight   relative share when a meal has two slots of the same category
 *   min/max  clamps on a fitted slot
 */

const veg = (role, id, base) => ({ role, category: 'vegetable', id, base })
const fruit = (role, id, base) => ({ role, category: 'fruit', id, base })
const protein = (role, id, weight = 1) => ({ role, category: 'protein', id, weight, min: 40, max: 350 })
// Dinner's starch has to be able to carry ~40% of the day's carbs. Whole-food
// starches are carb-dilute (sweet potato is 21 g per 100 g), so the ceiling has
// to be generous or the solver clamps and the meal silently under-delivers.
const carb = (role, id, max = 520) => ({ role, category: 'carb', id, min: 15, max })
const fat = (role, id, max = 60) => ({ role, category: 'fat', id, min: 3, max })
const liquid = (role, id, base) => ({ role, category: 'liquid', id, base })

export const WEEK_TEMPLATES = [
  // ── Sunday ────────────────────────────────────────────────────────────────
  {
    name: 'Sunday reset',
    meals: {
      breakfast: {
        title: 'Egg scramble, potato & blueberries',
        slots: [protein('protein', 'whole_egg', 1), protein('protein2', 'egg_white', 1.4), veg('veg', 'spinach', 100), fruit('fruit', 'blueberries', 150), carb('carb', 'white_potato', 260), fat('fat', 'avocado', 80)],
      },
      lunch: {
        title: 'Chicken, broccoli & quinoa',
        slots: [protein('protein', 'chicken_breast'), veg('veg', 'broccoli', 180), veg('veg2', 'carrots', 90), carb('carb', 'quinoa', 250), fat('fat', 'olive_oil', 20)],
      },
      snack: {
        title: 'Greek yogurt, raspberries & granola',
        slots: [protein('protein', 'greek_yogurt'), fruit('fruit', 'raspberries', 100), carb('carb', 'granola', 40)],
      },
      shake: {
        title: 'Whey, oat milk & banana',
        slots: [protein('protein', 'whey_isolate'), liquid('liquid', 'oat_milk', 200), fruit('fruit', 'banana', 80)],
      },
      dinner: {
        title: 'Salmon, sweet potato & green beans',
        slots: [protein('protein', 'salmon'), carb('carb', 'sweet_potato'), veg('veg', 'green_beans', 180), veg('veg2', 'red_onion', 60), fat('fat', 'olive_oil', 25)],
      },
    },
  },
  // ── Monday ────────────────────────────────────────────────────────────────
  {
    name: 'Bowl day',
    meals: {
      breakfast: {
        title: 'Yogurt & oat bowl with a veg side',
        slots: [protein('protein', 'greek_yogurt'), carb('carb', 'oats', 90), fruit('fruit', 'strawberries', 150), veg('veg', 'cucumber', 100), veg('veg2', 'tomato', 80), fat('fat', 'chia_seeds', 25)],
      },
      lunch: {
        title: 'Tuna salad with quinoa',
        slots: [protein('protein', 'tuna_canned'), veg('veg', 'cucumber', 120), veg('veg2', 'tomato', 120), veg('veg3', 'red_onion', 40), carb('carb', 'quinoa', 250), fat('fat', 'olive_oil', 20)],
      },
      snack: {
        title: 'Cottage cheese, apple & granola',
        slots: [protein('protein', 'cottage_cheese'), fruit('fruit', 'apple', 150), carb('carb', 'granola', 40)],
      },
      shake: {
        title: 'Whey, oat milk & banana',
        slots: [protein('protein', 'whey_isolate'), liquid('liquid', 'oat_milk', 200), fruit('fruit', 'banana', 80)],
      },
      dinner: {
        title: 'Chicken, brown rice & roast vegetables',
        slots: [protein('protein', 'chicken_breast'), carb('carb', 'brown_rice'), veg('veg', 'zucchini', 170), veg('veg2', 'bell_pepper', 110), fat('fat', 'olive_oil', 25)],
      },
    },
  },
  // ── Tuesday ───────────────────────────────────────────────────────────────
  {
    name: 'Lean & green',
    meals: {
      breakfast: {
        title: 'Cottage cheese, kiwi & peppers',
        slots: [protein('protein', 'cottage_cheese'), fruit('fruit', 'kiwi', 120), veg('veg', 'bell_pepper', 120), carb('carb', 'granola', 50), fat('fat', 'almonds', 30)],
      },
      lunch: {
        title: 'Turkey, kale & rice',
        slots: [protein('protein', 'turkey_breast'), veg('veg', 'kale', 80), veg('veg2', 'bell_pepper', 120), carb('carb', 'brown_rice', 230), fat('fat', 'avocado', 80)],
      },
      snack: {
        title: 'Greek yogurt, blueberries & granola',
        slots: [protein('protein', 'greek_yogurt'), fruit('fruit', 'blueberries', 120), carb('carb', 'granola', 40)],
      },
      shake: {
        title: 'Whey, oat milk & blueberries',
        slots: [protein('protein', 'whey_isolate'), liquid('liquid', 'oat_milk', 200), fruit('fruit', 'blueberries', 80)],
      },
      dinner: {
        title: 'Beef, sweet potato & broccoli',
        slots: [protein('protein', 'ground_beef_90'), carb('carb', 'sweet_potato'), veg('veg', 'broccoli', 180), veg('veg2', 'garlic', 6), fat('fat', 'olive_oil', 25)],
      },
    },
  },
  // ── Wednesday ─────────────────────────────────────────────────────────────
  {
    name: 'Midweek prep',
    meals: {
      breakfast: {
        title: 'Omelette with mushrooms & tomato',
        slots: [protein('protein', 'whole_egg', 1), protein('protein2', 'egg_white', 1.4), veg('veg', 'mushrooms', 100), veg('veg2', 'tomato', 80), fruit('fruit', 'orange', 130), carb('carb', 'white_potato', 130), fat('fat', 'olive_oil', 15)],
      },
      lunch: {
        title: 'Chicken with cauliflower & potato',
        slots: [protein('protein', 'chicken_breast'), veg('veg', 'cauliflower', 180), veg('veg2', 'green_onions', 30), carb('carb', 'white_potato', 260), fat('fat', 'olive_oil', 20)],
      },
      snack: {
        title: 'Yogurt, strawberries, oats & almonds',
        slots: [protein('protein', 'greek_yogurt'), fruit('fruit', 'strawberries', 150), carb('carb', 'oats', 60), fat('fat', 'almonds', 25)],
      },
      shake: {
        title: 'Whey, oat milk & banana',
        slots: [protein('protein', 'whey_isolate'), liquid('liquid', 'oat_milk', 200), fruit('fruit', 'banana', 80)],
      },
      dinner: {
        title: 'Cod, potatoes & asparagus',
        slots: [protein('protein', 'cod'), carb('carb', 'white_potato'), veg('veg', 'asparagus', 160), veg('veg2', 'tomato', 100), fat('fat', 'olive_oil', 25)],
      },
    },
  },
  // ── Thursday ──────────────────────────────────────────────────────────────
  {
    name: 'Light & fast',
    meals: {
      breakfast: {
        title: 'Yogurt, pear & greens',
        slots: [protein('protein', 'greek_yogurt'), fruit('fruit', 'pear', 150), veg('veg', 'spinach', 60), veg('veg2', 'cucumber', 100), carb('carb', 'oats', 70), fat('fat', 'chia_seeds', 25)],
      },
      lunch: {
        title: 'Shrimp, zucchini & quinoa',
        slots: [protein('protein', 'shrimp'), veg('veg', 'zucchini', 150), veg('veg2', 'tomato', 120), carb('carb', 'quinoa', 250), fat('fat', 'olive_oil', 22)],
      },
      snack: {
        title: 'Cottage cheese, pear & granola',
        slots: [protein('protein', 'cottage_cheese'), fruit('fruit', 'pear', 150), carb('carb', 'granola', 40)],
      },
      shake: {
        title: 'Whey, oat milk & banana',
        slots: [protein('protein', 'whey_isolate'), liquid('liquid', 'oat_milk', 200), fruit('fruit', 'banana', 80)],
      },
      dinner: {
        title: 'Turkey, rice & roasted eggplant',
        slots: [protein('protein', 'turkey_breast'), carb('carb', 'brown_rice'), veg('veg', 'eggplant', 150), veg('veg2', 'zucchini', 130), fat('fat', 'olive_oil', 25)],
      },
    },
  },
  // ── Friday ────────────────────────────────────────────────────────────────
  {
    name: 'Strong finish',
    meals: {
      breakfast: {
        title: 'Turkey, avocado & tomato plate',
        slots: [protein('protein', 'turkey_breast'), veg('veg', 'tomato', 100), veg('veg2', 'bell_pepper', 80), fruit('fruit', 'apple', 150), carb('carb', 'sweet_potato', 130), fat('fat', 'avocado', 80)],
      },
      lunch: {
        title: 'Beef, green beans & rice',
        slots: [protein('protein', 'ground_beef_90'), veg('veg', 'green_beans', 170), veg('veg2', 'mushrooms', 90), carb('carb', 'brown_rice', 230), fat('fat', 'parmesan', 35)],
      },
      snack: {
        title: 'Yogurt, banana, oats & peanut butter',
        slots: [protein('protein', 'greek_yogurt'), fruit('fruit', 'banana', 100), carb('carb', 'oats', 60), fat('fat', 'peanut_butter', 35)],
      },
      shake: {
        title: 'Whey, oat milk & banana',
        slots: [protein('protein', 'whey_isolate'), liquid('liquid', 'oat_milk', 220), fruit('fruit', 'banana', 80)],
      },
      dinner: {
        title: 'Salmon, sweet potato, kale & carrots',
        slots: [protein('protein', 'salmon'), carb('carb', 'sweet_potato'), veg('veg', 'kale', 90), veg('veg2', 'carrots', 110), fat('fat', 'olive_oil', 25)],
      },
    },
  },
  // ── Saturday ──────────────────────────────────────────────────────────────
  {
    name: 'Weekend plate',
    meals: {
      breakfast: {
        title: 'Scramble with asparagus & raspberries',
        slots: [protein('protein', 'whole_egg', 1), protein('protein2', 'egg_white', 1.4), veg('veg', 'asparagus', 120), veg('veg2', 'red_onion', 40), fruit('fruit', 'raspberries', 120), carb('carb', 'white_potato', 140), fat('fat', 'olive_oil', 15)],
      },
      lunch: {
        title: 'Cod, broccoli & potatoes',
        slots: [protein('protein', 'cod'), veg('veg', 'broccoli', 160), veg('veg2', 'carrots', 80), carb('carb', 'white_potato', 260), fat('fat', 'olive_oil', 22)],
      },
      snack: {
        title: 'Greek yogurt, kiwi & granola',
        slots: [protein('protein', 'greek_yogurt'), fruit('fruit', 'kiwi', 120), carb('carb', 'granola', 40)],
      },
      shake: {
        title: 'Whey, oat milk & banana',
        slots: [protein('protein', 'whey_isolate'), liquid('liquid', 'oat_milk', 200), fruit('fruit', 'banana', 80)],
      },
      dinner: {
        title: 'Shrimp, rice & green beans',
        slots: [protein('protein', 'shrimp'), carb('carb', 'brown_rice'), veg('veg', 'green_beans', 170), veg('veg2', 'mushrooms', 100), fat('fat', 'olive_oil', 25)],
      },
    },
  },
]

export const DEFAULT_WEEK_TYPES = {
  0: 'strength', // Sunday
  1: 'cardio',
  2: 'strength', // Tuesday
  3: 'cardio',
  4: 'cardio',
  5: 'strength', // Friday
  6: 'cardio',
}

export const DEFAULT_SCHEDULE = {
  cardio: '07:00',
  breakfast: '08:00',
  lunch: '12:30',
  snack: '15:30',
  strength: '17:30',
  shake: '18:30',
  dinner: '19:00',
  bed: '22:30',
}

/** Which clock time each meal slot maps to. */
export const MEAL_TIME_KEY = {
  breakfast: 'breakfast',
  lunch: 'lunch',
  snack: 'snack',
  shake: 'shake',
  dinner: 'dinner',
}
