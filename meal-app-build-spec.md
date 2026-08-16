# Meal Planning App — Build Spec for Claude Code

## What this is
A personal PWA (progressive web app) that shows what to eat, when, in what amount, why that timing was chosen, and helps manage cravings. Runs on a Galaxy S26 Ultra (phone) and Galaxy Tab S9 Ultra (tablet), installable via "Add to Home Screen."

## Devices & Install
- Target devices: Galaxy S26 Ultra (phone) and Galaxy Tab S9 Ultra (tablet), both stock Android/Samsung.
- A PWA installed via "Add to Home Screen" is not an OS-level app install. No APK, no Play Store, no "install from unknown sources" permission. It's a bookmarked page with a manifest and service worker that Chrome or Samsung Internet wraps into a full-screen icon. This sidesteps most device install restrictions (the kind that block sideloaded APKs), since nothing is actually installed as a package.
- If there's a stricter restriction in place that blocks Add to Home Screen or service workers specifically, that's uncommon and would need to be flagged separately, but assume the standard PWA path works unless proven otherwise.
- Build one responsive layout that works at both phone and tablet width rather than two separate versions.

## Core value
- Answers "what do I eat right now" instantly, one screen
- Explains why that food, at that time, given the day's training
- Lets you swap ingredients without doing math
- Generates prep-day checklists and shopping lists
- Gives visibility into cravings instead of just white-knuckling them

## Tech approach
- React + Vite PWA, responsive for phone and tablet
- Data stored locally on the device (localStorage or IndexedDB), no backend needed for v1
- No login, no server, nothing to host or pay for
- manifest.json + service worker for offline install and full offline operation

## Where nutrition data comes from
- USDA FoodData Central (https://fdc.nal.usda.gov/), free, no signup
- The 50-ingredient table below is pre-researched and ready to hand to the app as a static JSON file, no live API calls needed

## Decisions
- **Swap scope:** locked list, only the ingredients in the table below. No free-form ingredient entry in v1.
- **Calorie target:** fixed number, entered manually in settings, adjusted by hand when needed.
- **Offline:** must work fully offline, no network calls at runtime.

---

## Daily Schedule & Meal Timing Logic

This is static logic, not "AI" — a set of rules baked into which meal template loads for which day type.

- **Breakfast, after morning cardio:** protein + light carb (fruit) + vegetables. Training fasted is fine, appetite right after Zone 2 work is usually low, that's normal, no need to force a bigger meal here.
- **Lunch, at the desk:** the most protein-dense meal of the day. A sedentary afternoon with a protein-forward lunch avoids the energy crash a heavy-carb lunch would cause while sitting still.
- **Afternoon snack:** protein + carb (yogurt, berries, granola), placed mid-afternoon deliberately as a buffer before the highest-risk window for overeating: the evening.
- **Post-training shake:** training days only, right after strength work. Purpose is hitting the protein target, not performance.
- **Dinner, the largest meal:** protein + a real carb portion (rice or sweet potato) + vegetables. Two reasons this is carb-inclusive rather than carb-free:
  1. Research on evening carbohydrate and sleep suggests a moderate carb dinner eaten roughly 3 to 4 hours before bed can ease falling asleep, via a tryptophan/serotonin pathway. This beats both a very low-carb dinner and carbs eaten right at bedtime.
  2. It's the one meal that can comfortably carry more food and more volume, which matters directly for the craving/binge risk described below.
- **Meal-to-bed timing:** aim to finish dinner 3 to 4 hours before sleep where the schedule allows. A meal in the last hour before bed is more likely to disrupt sleep through reflux and gastric activity, independent of what's in it.
- **Strength day vs. cardio-only day:** on strength days, weight extra carbs toward dinner instead of (or in addition to) the shake, since carbohydrate right after resistance training supports glycogen replenishment. This is what the training day toggle feature (below) controls.

---

## Craving Management

The grounding for this: a study published in Nature in 2024 (Hinte et al., ETH Zurich) found that fat cells retain what researchers call an "obesogenic memory," lasting epigenetic changes from a period of excess fat mass that persist after weight loss, and that appear to prime the body toward stronger hunger signaling and faster regain once food is abundant again. This has been shown clearly in mice, and the underlying cellular changes have also been observed in human fat tissue. It's real, active research, not settled on exactly how strong or how long-lasting the effect is in humans, and there's currently no known way to reverse it directly.

Practically: the cravings likely have a biological basis, not just a discipline gap. What the evidence supports as actually helping:

- Protein and fiber at every meal, not just dinner. These are the strongest levers for satiety hormones (GLP-1, PYY, ghrelin suppression), and this plan already front-loads protein.
- Don't let any single meal run too low in volume or calories. Undereating earlier in the day is one of the most reliable predictors of an evening binge.
- Keep dinner carb-inclusive, not carb-free. A carb-free evening is a common personal trigger for a craving spiral, both physiologically and psychologically.
- Sleep matters directly: even one night of short or poor sleep measurably raises ghrelin and next-day cravings for high-calorie food. Protecting the dinner timing above supports this.
- Stress independently increases preference for high-fat, high-sugar food. Diet alone doesn't touch this, it needs to be managed separately.
- Consistent meal timing, not skipping and not wildly variable eating windows, reduces the extreme-hunger spikes that make a craving hard to resist in the moment.

---

## Core Features for v1

1. **Today view** — full plan for the day: breakfast, lunch, snack, post-training, dinner, with exact amounts. One screen, no scrolling to find "what's next."
2. **Swap engine** — each meal slot has a category (protein / carb / vegetable / fruit). Swapping within a category auto-recalculates that meal's macros against the daily target.
3. **Portion scaler** — food amounts scale live if the daily target is changed in settings.
4. **Weekly view** — the 7-day table, editable.
5. **Shopping list generator** — totals raw ingredient amounts across the week into one list.
6. **Prep checklist** — Sunday and Wednesday lists, scaled to however many portions are needed that week.
7. **Storage/expiry tracker** — flags "eat by" per prepped item (e.g. chicken good through Wednesday).
8. **Timing rationale** — each meal slot shows a one-line "why now" pulled from the schedule logic above, so the plan explains itself instead of just issuing instructions.
9. **Training day toggle** — select Rest / Cardio only / Strength today. Shifts where the day's carbs land (more at dinner on strength days) and loads the matching meal template. No calculation, just a pre-set swap.
10. **Craving log** — one tap to log a craving: time, and a short tag (stress, tired, bored, still hungry after a meal). No analysis needed in the app, just a simple list and count view by day and by tag, so patterns become visible after a few weeks.

## Nice to have, not required for v1
- Daily weigh-in log with a simple trend line
- "What I actually ate" logging vs. plan
- Push notification reminder for prep days
- Multi-device sync (needs a backend, real added complexity, skip unless actually needed)

---

## Ingredient Database (50 items, macros per 100g)

Values are typical USDA-based figures. Branded items (granola, oat milk, whey) vary meaningfully by product, check the label and adjust in the JSON once.

### Proteins
| Ingredient | State | kcal | Protein g | Fat g | Carbs g |
|---|---|---|---|---|---|
| Chicken breast | cooked | 165 | 31 | 3.6 | 0 |
| Ground beef 90/10 | cooked | 220 | 26 | 12 | 0 |
| Cod | cooked | 105 | 23 | 0.9 | 0 |
| Salmon (Atlantic, farmed) | cooked | 208 | 20 | 13 | 0 |
| Shrimp | cooked | 99 | 24 | 0.3 | 0.2 |
| Turkey breast | cooked | 135 | 30 | 1 | 0 |
| Tuna, canned in water | drained | 116 | 26 | 0.8 | 0 |
| Whole egg | cooked | 155 | 13 | 11 | 1.1 |
| Egg white | cooked | 52 | 11 | 0.2 | 0.7 |
| Greek yogurt, 0% | as eaten | 59 | 10 | 0.4 | 3.6 |
| Whey protein isolate | powder | 375 | 80 | 2 | 6 |

### Carbs / Starches
| Ingredient | State | kcal | Protein g | Fat g | Carbs g |
|---|---|---|---|---|---|
| Brown (full grain) rice | cooked | 123 | 2.7 | 1 | 26 |
| Sweet potato | cooked | 90 | 2 | 0.1 | 21 |
| White potato | cooked | 87 | 1.9 | 0.1 | 20 |
| Oats | dry | 389 | 17 | 7 | 66 |
| Quinoa | cooked | 120 | 4.4 | 1.9 | 21 |

### Vegetables
| Ingredient | State | kcal | Protein g | Fat g | Carbs g |
|---|---|---|---|---|---|
| Zucchini | raw | 17 | 1.2 | 0.3 | 3.1 |
| Bell pepper | raw | 31 | 1 | 0.3 | 6 |
| Carrots | raw | 41 | 0.9 | 0.2 | 10 |
| Green beans | raw | 31 | 1.8 | 0.2 | 7 |
| Green onions | raw | 32 | 1.8 | 0.2 | 7.3 |
| Asparagus | raw | 20 | 2.2 | 0.1 | 3.9 |
| Broccoli | raw | 34 | 2.8 | 0.4 | 7 |
| Spinach | raw | 23 | 2.9 | 0.4 | 3.6 |
| Cucumber | raw | 15 | 0.7 | 0.1 | 3.6 |
| Tomato | raw | 18 | 0.9 | 0.2 | 3.9 |
| Mushrooms (white) | raw | 22 | 3.1 | 0.3 | 3.3 |
| Cauliflower | raw | 25 | 1.9 | 0.3 | 5 |
| Kale | raw | 49 | 4.3 | 0.9 | 8.8 |
| Red onion | raw | 40 | 1.1 | 0.1 | 9.3 |
| Garlic | raw | 149 | 6.4 | 0.5 | 33 |
| Celery | raw | 16 | 0.7 | 0.2 | 3 |
| Eggplant | raw | 25 | 1 | 0.2 | 6 |

### Fruits
| Ingredient | State | kcal | Protein g | Fat g | Carbs g |
|---|---|---|---|---|---|
| Apple | raw | 52 | 0.3 | 0.2 | 14 |
| Blueberries | raw | 57 | 0.7 | 0.3 | 14 |
| Strawberries | raw | 32 | 0.7 | 0.3 | 7.7 |
| Raspberries | raw | 52 | 1.2 | 0.7 | 12 |
| Banana | raw | 89 | 1.1 | 0.3 | 23 |
| Orange | raw | 47 | 0.9 | 0.1 | 12 |
| Kiwi | raw | 61 | 1.1 | 0.5 | 15 |
| Pear | raw | 57 | 0.4 | 0.1 | 15 |

### Fats / Dairy / Other
| Ingredient | State | kcal | Protein g | Fat g | Carbs g |
|---|---|---|---|---|---|
| Olive oil | — | 884 | 0 | 100 | 0 |
| Avocado | raw | 160 | 2 | 15 | 8.5 |
| Almonds | raw | 579 | 21 | 50 | 22 |
| Peanut butter (natural) | — | 588 | 25 | 50 | 20 |
| Oat milk, unsweetened | as eaten | 40 | 0.8 | 1.5 | 6 |
| Low carb granola | check label | 450 | 15 | 30 | 25 |
| Chia seeds | dry | 486 | 17 | 31 | 42 |
| Cottage cheese, low fat | as eaten | 72 | 12 | 1 | 3.4 |
| Parmesan cheese | — | 431 | 38 | 29 | 4.1 |

---

## Recommended v1 scope for one Claude Code session
Local-only, fully offline, responsive PWA for phone and tablet. Hardcoded ingredient database (table above, as JSON). Fixed daily calorie/macro target set once in settings. Today view with timing rationale, Weekly view, swap engine limited to the ingredient table, training day toggle, craving log, shopping list, prep checklist. No login, no backend, no sync, no live API calls. Installable via "Add to Home Screen."
