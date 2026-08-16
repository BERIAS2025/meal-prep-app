/**
 * The "why now" copy. Every meal slot explains its own placement so the plan
 * argues for itself instead of just issuing instructions.
 *
 * `line` is the one-liner shown inline on the meal card.
 * `detail` is the fuller reasoning behind the info button.
 */

export const RATIONALE = {
  breakfast: {
    line: 'Straight after morning cardio — protein, a light carb and vegetables.',
    detail:
      'Training fasted is fine. Appetite right after Zone 2 work is usually low, and that is normal — there is no need to force a bigger meal here. Protein and vegetables go in first, with fruit as the light carb.',
  },
  lunch: {
    line: 'The most protein-dense meal of the day, and deliberately light on carbs.',
    detail:
      'The afternoon is sedentary. A protein-forward lunch avoids the energy crash a heavy-carb lunch causes while sitting still. Carbs are kept low here on purpose and reappear at dinner.',
  },
  snack: {
    line: 'Placed mid-afternoon as a buffer before the evening — the highest-risk window.',
    detail:
      'This slot exists to stop you arriving at dinner extremely hungry. Undereating earlier in the day is one of the most reliable predictors of an evening binge, so this meal is not optional filler.',
  },
  shake: {
    line: 'Straight after strength work. This is about hitting the protein target, not performance.',
    detail:
      'On strength days the protein target is harder to reach from whole food alone. The shake closes that gap. It is not a performance supplement, and it disappears on cardio-only and rest days.',
  },
  dinner: {
    line: 'The largest meal — protein, a real carb portion and vegetables.',
    detail:
      'Carb-inclusive for two reasons. First, research on evening carbohydrate and sleep suggests a moderate carb dinner eaten roughly 3 to 4 hours before bed can ease falling asleep, via a tryptophan and serotonin pathway — better than both a very low-carb dinner and carbs eaten right at bedtime. Second, this is the one meal that can comfortably carry more food and more volume, which matters directly for craving and binge risk.',
  },
}

/** Extra line appended on strength days, where the carb split shifts. */
export const STRENGTH_DINNER_NOTE =
  'Strength day: extra carbs are weighted here rather than earlier, to support glycogen replenishment after resistance work.'

export const DAY_TYPE_NOTE = {
  rest: 'Rest day. No shake, and the day\'s carbs sit slightly flatter across meals.',
  cardio: 'Cardio-only day. No shake — the protein target is reachable from whole food.',
  strength: 'Strength day. A post-training shake is added and extra carbs shift to dinner.',
}

export const CRAVING_TAGS = [
  { id: 'stress', label: 'Stress', hint: 'Stress independently raises the pull toward high-fat, high-sugar food.' },
  { id: 'tired', label: 'Tired', hint: 'Short or poor sleep measurably raises ghrelin and next-day cravings.' },
  { id: 'bored', label: 'Bored', hint: 'No hunger signal behind it — the strongest candidate for a non-food response.' },
  { id: 'still_hungry', label: 'Still hungry', hint: 'Following a meal. Worth checking whether that meal ran too low in volume.' },
  { id: 'social', label: 'Social / food around', hint: 'Cue-driven rather than need-driven.' },
  { id: 'other', label: 'Other', hint: '' },
]

/** Background shown once in the craving view, and behind the info button. */
export const CRAVING_BACKGROUND = {
  title: 'Why this is logged rather than resisted',
  body: [
    'A 2024 Nature study (Hinte et al., ETH Zürich) found that fat cells retain what researchers call an "obesogenic memory" — lasting epigenetic changes from a period of excess fat mass that persist after weight loss, and that appear to prime the body toward stronger hunger signalling and faster regain once food is abundant again.',
    'This has been shown clearly in mice, and the underlying cellular changes have also been observed in human fat tissue. It is active research, not settled science: how strong the effect is in humans, and how long it lasts, is not yet known, and there is currently no known way to reverse it directly.',
    'The practical read: the cravings likely have a biological basis, not just a discipline gap. Logging them makes the pattern visible — which time of day, which trigger — so it can be answered with something other than willpower.',
  ],
  levers: [
    'Protein and fiber at every meal, not just dinner. These are the strongest levers on satiety hormones (GLP-1, PYY, ghrelin suppression).',
    'Do not let any single meal run too low. Undereating earlier is one of the most reliable predictors of an evening binge.',
    'Keep dinner carb-inclusive. A carb-free evening is a common trigger for a craving spiral, both physiologically and psychologically.',
    'Protect sleep. Even one short night raises ghrelin and next-day cravings for high-calorie food.',
    'Manage stress separately. Diet alone does not touch this lever.',
    'Keep meal timing consistent. Skipping and wildly variable eating windows create the extreme-hunger spikes that are hardest to resist in the moment.',
  ],
}

export const SLEEP_RULE = {
  ok: 'Dinner finishes 3–4 hours before bed, which is the window this plan aims for.',
  tight:
    'Under 3 hours between dinner and bed. A meal in the last hour before sleep is more likely to disrupt it through reflux and gastric activity, independent of what is in it.',
  wide: 'More than 5 hours between dinner and bed. Watch for late hunger — the afternoon snack matters more on days like this.',
}
