# Meal plan

A personal, offline-first PWA: what to eat, when, in what amount, and why that timing was
chosen. No account, no server, no network calls at runtime. Everything lives in the browser's
local storage on the device it runs on.

Built for a Galaxy S26 Ultra and a Galaxy Tab S9 Ultra from one responsive layout.

---

## Getting it onto your phone

You cannot install this from files copied onto the phone. Android needs a **secure context**
(HTTPS) before it will register a service worker, and the service worker is what makes the app
installable and offline-capable. A `file://` page cannot register one at all, and neither can
`http://192.168.x.x`. It has to be served over HTTPS from somewhere. GitHub Pages does that for
free, permanently, for public repositories.

### One-time setup

1. Create a new **public** repository on GitHub. Any name works — the build uses relative paths,
   so it does not care whether it ends up at `you.github.io/meal-prep-app/` or anywhere else.

2. From this folder, push it up (replace the URL with your own):

   ```bash
   git remote add origin https://github.com/YOUR-USERNAME/meal-prep-app.git
   ```

   ```bash
   git push -u origin main
   ```

3. On GitHub: **Settings → Pages → Build and deployment → Source → GitHub Actions**.
   That is the only setting to change.

4. Open the **Actions** tab. The deploy workflow runs on its own, takes about a minute, and
   prints the live URL when it finishes. Something like
   `https://YOUR-USERNAME.github.io/meal-prep-app/`.

From then on, every `git push` rebuilds and redeploys automatically.

### Installing it

Open the URL on the phone in Chrome or Samsung Internet.

- If an **Install** button appears in the app's own top bar, tap that.
- Otherwise use the browser menu: **⋮ → Add to Home screen** (Samsung Internet calls it
  **Add page to → Home screen**).

That gives a normal-looking icon that opens full screen with no browser chrome. It is not an
OS-level package install, so none of the usual sideloading restrictions apply.

Repeat on the tablet — the two devices keep entirely separate data.

---

## Day to day

| Screen | What it does |
|---|---|
| **Today** | The whole day, with the current or next meal pulled to the top. Tap any ingredient to swap it; every amount re-solves instantly. Each meal explains its own placement. |
| **Week** | All seven days. Switch a day between Rest / Cardio / Strength — either for that date only, or as the new normal for that weekday. |
| **Shop** | The week totalled into one list, in **buy** amounts: raw and untrimmed for meat and vegetables, dry for rice and quinoa. |
| **Prep** | Sunday and Wednesday cook-ahead lists, each covering up to the next prep day. Ticking a task files it in the fridge list with an eat-by date. |
| **Log** | One tap to log a craving with a trigger. Counts by trigger and by hour of day, so the pattern shows itself after a couple of weeks. |
| **Settings** | Your numbers, the goal, the daily rhythm, prep days, theme, ingredients to hide, and backup. |

The **Craving** button floats on every screen. Two taps, no typing required.

---

## How the numbers work

1. **BMR** from Mifflin-St Jeor, or Katch-McArdle if you enter a body-fat percentage.
2. **TDEE** = BMR × your activity factor.
3. **Target** = TDEE adjusted by the goal you pick (aggressive −25%, moderate −18%, slow −10%,
   maintenance 0%). It is never allowed below your BMR — planning under resting expenditure is
   the pattern that most reliably ends in an evening binge.
4. **Protein** and **fat** come from grams per kg of bodyweight (defaults 2.0 and 0.8, both
   adjustable). **Carbs** are whatever calories are left.
5. Each meal gets a share of each macro depending on the day type. Lunch carries the most
   protein and deliberately few carbs; dinner carries about 40% of the day's carbs, more on
   strength days.
6. The **portion solver** fits vegetables and fruit first at a fixed serving — they are there
   for volume and fiber, not for hitting macros — then fits protein, carbs and fat to what is
   left, repeating a few times so mixed-macro ingredients settle out.

Nothing is forced to land exactly on target. Every meal shows what it actually delivers against
what it was aiming for, so a swap that pulls a meal off plan is visible rather than silently
rebalanced.

These are estimates from standard equations, not measurements. Adjust against the scale over two
to three weeks. Not medical advice.

---

## Changing the data

Everything is in plain files, no build step needed to understand them:

- `src/data/ingredients.js` — the 50 ingredients, macros per 100 g, plus fiber, fridge life and
  raw-to-cooked yield factors. **Branded items vary a lot** — check the label on your granola,
  oat milk and whey and correct the numbers here once.
- `src/data/templates.js` — the seven day templates: which ingredient fills which slot.
- `src/data/rationale.js` — the "why now" copy shown on each meal.
- `src/lib/nutrition.js` — activity factors, goal adjustments, and the macro split per meal.

---

## Your data

It is stored only in this browser, on this device. No account, no sync, nothing leaves the
phone. That also means **clearing the browser's site data wipes it**. Settings has an
**Export backup** button that writes a JSON file, and a **Restore backup** button that reads one
back. Worth doing occasionally.

---

## Local development

```bash
npm install
```

```bash
npm run dev
```

| Command | Does |
|---|---|
| `npm run dev` | Dev server with hot reload |
| `npm run build` | Production build into `dist/`, then injects the service worker precache list |
| `npm run preview` | Serves the built `dist/` — use this to test offline behaviour |
| `npm run icons` | Regenerates the PWA icons from `scripts/gen-icons.mjs` |

The service worker only registers in production builds, so `npm run dev` never serves you a
stale cache.

Nutrition figures are USDA-typical values per 100 g, from
[FoodData Central](https://fdc.nal.usda.gov/).
