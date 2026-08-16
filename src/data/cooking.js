/**
 * How to actually cook each thing, and whether it survives the freezer.
 *
 * Keyed by ingredient id. Anything not listed here needs no cooking.
 *
 *   best     the method worth defaulting to
 *   alt      a second option using different equipment
 *   freezes  'good'  — freeze it without thinking
 *            'ok'    — works, texture drops a little
 *            'poor'  — technically possible, not worth it
 *            'no'    — do not
 *   note     the one thing that goes wrong if you ignore it
 *
 * Temperatures are fan/convection. A conventional oven wants about 20°C more.
 */

export const COOKING = {
  // ── Proteins ──────────────────────────────────────────────────────────────
  chicken_breast: {
    best: 'Air fryer — 190°C, 14–16 min, turn once',
    alt: 'Steam oven 180°C combi-steam, 18–20 min · or pan 3–4 min per side',
    freezes: 'good',
    note: 'Pull it at 70°C core and let it rest 5 min. Cooking to visibly dry is the usual mistake, and it is what makes reheated chicken unpleasant on day three.',
  },
  ground_beef_90: {
    best: 'Pan — high heat, no oil, break it up, 6–8 min',
    alt: 'Not worth the oven or air fryer',
    freezes: 'good',
    note: 'The pan needs to be properly hot and not crowded, or it steams grey instead of browning. Cook in two batches if it looks crowded. Drain the fat off after browning — the 90/10 numbers assume you do.',
  },
  cod: {
    best: 'Steam oven — 100°C pure steam, 8–10 min',
    alt: 'Air fryer 180°C 8–10 min · or pan 2–3 min per side',
    freezes: 'ok',
    note: 'Steam is genuinely the best tool you have for this. Cod dries out fast and goes from perfect to chalky in about two minutes.',
  },
  salmon: {
    best: 'Air fryer — 180°C, 9–11 min, skin side up',
    alt: 'Steam oven 180°C combi-steam 12–14 min · or pan skin-down 4 min, flip 2 min',
    freezes: 'ok',
    note: 'Cook it a shade under. It carries on cooking off the heat, and reheated salmon cooks again.',
  },
  shrimp: {
    best: 'Pan — high heat, 90 sec per side',
    alt: 'Air fryer 200°C 5–6 min',
    freezes: 'poor',
    note: 'Done the moment it turns opaque and curls into a C. A tight O means overcooked. This is the one protein worth cooking fresh rather than prepping ahead.',
  },
  turkey_breast: {
    best: 'Air fryer — 190°C, 15–18 min, turn once',
    alt: 'Steam oven 180°C combi-steam, 20–25 min',
    freezes: 'good',
    note: 'Leaner than chicken, so even less forgiving. Combi-steam is the safer route if you are cooking a big batch.',
  },
  whole_egg: {
    best: 'Pan — low heat, moved constantly, 3–4 min',
    alt: 'Boiled 7–8 min for a set yolk, 6 min for jammy',
    freezes: 'no',
    note: 'Cooked egg goes rubbery and weeps in the fridge. Cook these on the day.',
  },
  egg_white: {
    best: 'Pan — low heat with the whole eggs, 2–3 min',
    alt: 'Boiled with the whole eggs',
    freezes: 'no',
    note: 'Whites toughen faster than yolks. Off the heat while still glossy.',
  },

  // ── Carbs ─────────────────────────────────────────────────────────────────
  brown_rice: {
    best: 'Pot — 1 part rice to 2.2 water, simmer 25–30 min, rest 10 min lid on',
    alt: 'Steam oven 100°C, 35 min, same ratio',
    freezes: 'good',
    note: 'Cool it fast and refrigerate within an hour. Cooked rice left at room temperature is the one item on this list with a real food-safety issue.',
  },
  quinoa: {
    best: 'Pot — rinse first, 1 part to 2 water, simmer 15 min, rest 5 min',
    alt: 'Steam oven 100°C, 20 min',
    freezes: 'good',
    note: 'Rinsing is not optional — the coating is bitter.',
  },
  sweet_potato: {
    best: 'Air fryer — 200°C, cubed 2 cm, 20–25 min, shake halfway',
    alt: 'Oven 200°C 30–35 min · or steam 100°C 20 min then 8 min hot air for colour',
    freezes: 'ok',
    note: 'Cubes reheat far better than whole. Steam-then-roast gives fluffy inside and browned edges.',
  },
  white_potato: {
    best: 'Air fryer — 200°C, cubed 2 cm, 22–28 min, shake halfway',
    alt: 'Steam 100°C 18 min, then 10 min at 200°C hot air',
    freezes: 'poor',
    note: 'Roast potato goes grainy after freezing. Keep this one in the fridge and eat it inside four days.',
  },
  oats: {
    best: 'No cooking — soak overnight in the yogurt or milk',
    alt: 'Pot, 1 part to 2 liquid, 3–4 min',
    freezes: 'no',
    note: 'Overnight oats can be built for three days at once in jars.',
  },

  // ── Vegetables ────────────────────────────────────────────────────────────
  broccoli: {
    best: 'Steam oven — 100°C, 6–7 min',
    alt: 'Air fryer 190°C 10–12 min for charred edges',
    freezes: 'ok',
    note: 'Steam keeps the colour and the bite. Steam it a minute short if it will be reheated.',
  },
  cauliflower: {
    best: 'Air fryer — 190°C, 12–15 min',
    alt: 'Steam 100°C 8 min',
    freezes: 'ok',
    note: 'The air fryer is much better here — steamed cauliflower reheats bland and wet.',
  },
  green_beans: {
    best: 'Steam oven — 100°C, 6–8 min',
    alt: 'Air fryer 190°C 8–10 min',
    freezes: 'good',
    note: 'Straight into cold water after steaming if you are prepping ahead, or they keep cooking and go olive-coloured.',
  },
  asparagus: {
    best: 'Air fryer — 190°C, 7–9 min',
    alt: 'Steam 100°C 4–5 min',
    freezes: 'poor',
    note: 'Snap the woody ends off first. Three days in the fridge is its limit.',
  },
  zucchini: {
    best: 'Air fryer — 190°C, 10–12 min, cut thick',
    alt: 'Pan, high heat, 4–5 min',
    freezes: 'no',
    note: 'Cut it thick, salt it after cooking rather than before. Salted early it releases water and goes limp.',
  },
  bell_pepper: {
    best: 'Air fryer — 190°C, 10–12 min',
    alt: 'Oven 200°C 18–20 min · or raw',
    freezes: 'ok',
    note: 'Roasted peppers keep 4 days and get better on day two.',
  },
  carrots: {
    best: 'Air fryer — 190°C, 14–16 min, cut 1.5 cm',
    alt: 'Steam 100°C 10 min',
    freezes: 'ok',
    note: 'Cut them evenly or the thin ends burn before the thick ones soften.',
  },
  eggplant: {
    best: 'Air fryer — 190°C, 12–15 min',
    alt: 'Oven 200°C 20–25 min',
    freezes: 'poor',
    note: 'It drinks oil. Brush it lightly rather than tossing it, or the fat number stops being true.',
  },
  mushrooms: {
    best: 'Pan — high heat, dry, then oil at the end, 6–8 min',
    alt: 'Air fryer 190°C 8–10 min',
    freezes: 'ok',
    note: 'Dry pan first so the water cooks off, oil afterwards. Oil first and they stew.',
  },
  red_onion: {
    best: 'Air fryer — 190°C, 10–12 min in wedges',
    alt: 'Pan, medium, 8–10 min · or raw',
    freezes: 'ok',
    note: 'Raw in a salad it wants a 10-minute soak in cold water to lose the harshness.',
  },
  kale: {
    best: 'Pan — 2–3 min with a splash of water',
    alt: 'Air fryer 160°C 5 min for crisps · or raw, massaged',
    freezes: 'ok',
    note: 'Strip the leaves off the stems. Raw, it needs a minute of hand-massaging with oil and salt to stop being tough.',
  },
  spinach: {
    best: 'Pan — 60–90 sec, just until it collapses',
    alt: 'Raw',
    freezes: 'ok',
    note: 'It reduces to almost nothing. 120 g raw is one large handful, not a portion of cooked spinach.',
  },
  garlic: {
    best: 'Raw, crushed, into sauces',
    alt: 'Whole cloves roasted 180°C 20 min turn sweet and mild',
    freezes: 'ok',
    note: 'Crush it and leave it 10 minutes before it meets heat.',
  },
  green_onions: { best: 'Raw, sliced', alt: 'Pan 1–2 min at the end', freezes: 'poor', note: '' },
  tomato: { best: 'Raw', alt: 'Air fryer 180°C 8 min to concentrate them', freezes: 'no', note: 'Never refrigerate whole tomatoes — it kills the flavour and the texture.' },
  cucumber: { best: 'Raw', alt: '—', freezes: 'no', note: 'Salt it and drain 10 min before it goes into a yogurt sauce, or the sauce turns watery.' },
  celery: { best: 'Raw', alt: 'Pan, as a base, 5 min', freezes: 'poor', note: '' },
}

export const FREEZE_LABEL = {
  good: 'Freezes well',
  ok: 'Freezes acceptably',
  poor: 'Freezes badly',
  no: 'Do not freeze',
}

export const freezesWell = (id) => {
  const f = COOKING[id]?.freezes
  return f === 'good' || f === 'ok'
}
