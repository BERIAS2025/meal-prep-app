/**
 * Persistence. Everything lives in localStorage on this device — no account,
 * no server, no sync. That also means clearing browser data wipes it, so
 * Settings offers a JSON export/import as a manual backup.
 */

import { DEFAULT_SCHEDULE, DEFAULT_WEEK_TYPES } from '../data/templates.js'

export const STORAGE_KEY = 'mealprep.state.v1'
export const SCHEMA_VERSION = 1

export const DEFAULT_STATE = {
  version: SCHEMA_VERSION,
  onboarded: false,
  profile: {
    unitSystem: 'metric',
    sex: 'male',
    age: 40,
    heightCm: 180,
    weightKg: 90,
    bodyFatPct: null,
    activityLevel: 'high',
    goal: 'moderate',
    manualCalories: null,
    proteinPerKg: 2,
    fatPerKg: 0.8,
  },
  schedule: { ...DEFAULT_SCHEDULE },
  weekTypes: { ...DEFAULT_WEEK_TYPES },
  dayOverrides: {},
  cravings: [],
  prepDays: [0, 3],
  portions: 1,
  hidden: [],
  prepChecks: {},
  storageItems: [],
  shoppingChecks: {},
  theme: 'auto',
  weighIns: [],
}

/** Shallow-merge defaults so a state saved by an older build still loads. */
function hydrate(raw) {
  if (!raw || typeof raw !== 'object') return { ...DEFAULT_STATE }
  return {
    ...DEFAULT_STATE,
    ...raw,
    version: SCHEMA_VERSION,
    profile: { ...DEFAULT_STATE.profile, ...(raw.profile || {}) },
    schedule: { ...DEFAULT_STATE.schedule, ...(raw.schedule || {}) },
    weekTypes: { ...DEFAULT_STATE.weekTypes, ...(raw.weekTypes || {}) },
    dayOverrides: raw.dayOverrides || {},
    cravings: Array.isArray(raw.cravings) ? raw.cravings : [],
    prepDays: Array.isArray(raw.prepDays) ? raw.prepDays : DEFAULT_STATE.prepDays,
    hidden: Array.isArray(raw.hidden) ? raw.hidden : [],
    storageItems: Array.isArray(raw.storageItems) ? raw.storageItems : [],
    weighIns: Array.isArray(raw.weighIns) ? raw.weighIns : [],
    prepChecks: raw.prepChecks || {},
    shoppingChecks: raw.shoppingChecks || {},
  }
}

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return hydrate(raw ? JSON.parse(raw) : null)
  } catch {
    return { ...DEFAULT_STATE }
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch {
    // Quota exceeded or storage blocked (private mode). The app still works
    // for this session; the user just loses it on reload.
    return false
  }
}

export function exportState(state) {
  return JSON.stringify({ ...state, exportedAt: new Date().toISOString() }, null, 2)
}

export function importState(text) {
  const parsed = JSON.parse(text)
  if (!parsed || typeof parsed !== 'object') throw new Error('Not a valid backup file')
  if (!parsed.profile) throw new Error('This file does not look like a meal plan backup')
  return hydrate(parsed)
}

export const uid = () => `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 8)}`
