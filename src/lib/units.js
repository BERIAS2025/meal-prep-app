/** Storage is always metric. These only convert for display and input. */

export const KG_PER_LB = 0.45359237
export const CM_PER_IN = 2.54

export const kgToLb = (kg) => kg / KG_PER_LB
export const lbToKg = (lb) => lb * KG_PER_LB
export const cmToIn = (cm) => cm / CM_PER_IN
export const inToCm = (inch) => inch * CM_PER_IN

export function cmToFtIn(cm) {
  const total = Math.round(cmToIn(cm))
  return { ft: Math.floor(total / 12), in: total % 12 }
}

export function ftInToCm(ft, inch) {
  return inToCm((Number(ft) || 0) * 12 + (Number(inch) || 0))
}

export function displayWeight(kg, system) {
  return system === 'imperial' ? Math.round(kgToLb(kg)) : Math.round(kg * 10) / 10
}

export const weightUnit = (system) => (system === 'imperial' ? 'lb' : 'kg')
