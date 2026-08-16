import { createContext, useContext, useEffect, useMemo, useReducer, useRef } from 'react'
import { DEFAULT_STATE, loadState, saveState, uid } from '../lib/storage.js'
import { calcTargets } from '../lib/nutrition.js'

const StateCtx = createContext(null)
const DispatchCtx = createContext(null)

function withDay(state, dateKey, patch) {
  const current = state.dayOverrides[dateKey] || {}
  return {
    ...state,
    dayOverrides: {
      ...state.dayOverrides,
      [dateKey]: typeof patch === 'function' ? patch(current) : { ...current, ...patch },
    },
  }
}

function toggleIn(list, value) {
  return list.includes(value) ? list.filter((v) => v !== value) : [...list, value]
}

function reducer(state, action) {
  switch (action.type) {
    case 'hydrate':
      return action.state

    case 'profile':
      return { ...state, profile: { ...state.profile, ...action.patch } }

    case 'onboarded':
      return { ...state, onboarded: true, profile: { ...state.profile, ...(action.patch || {}) } }

    case 'schedule':
      return { ...state, schedule: { ...state.schedule, ...action.patch } }

    case 'weekType':
      return { ...state, weekTypes: { ...state.weekTypes, [action.weekday]: action.dayType } }

    case 'dayType':
      return withDay(state, action.dateKey, { dayType: action.dayType })

    case 'clearDayType':
      return withDay(state, action.dateKey, (d) => {
        const { dayType, ...rest } = d
        return rest
      })

    case 'extra':
      return withDay(state, action.dateKey, (d) => ({
        ...d,
        extras: toggleIn(d.extras || [], action.extra),
      }))

    case 'swap':
      return withDay(state, action.dateKey, (d) => ({
        ...d,
        swaps: { ...(d.swaps || {}), [`${action.meal}.${action.role}`]: action.ingredientId },
      }))

    case 'resetSwaps':
      return withDay(state, action.dateKey, (d) => {
        if (!action.meal) return { ...d, swaps: {} }
        const swaps = Object.fromEntries(
          Object.entries(d.swaps || {}).filter(([k]) => !k.startsWith(`${action.meal}.`)),
        )
        return { ...d, swaps }
      })

    case 'mealDone':
      return withDay(state, action.dateKey, (d) => ({
        ...d,
        done: { ...(d.done || {}), [action.meal]: !(d.done || {})[action.meal] },
      }))

    case 'addCraving':
      return {
        ...state,
        cravings: [
          { id: uid(), ts: Date.now(), tag: action.tag, note: action.note || '' },
          ...state.cravings,
        ],
      }

    case 'deleteCraving':
      return { ...state, cravings: state.cravings.filter((c) => c.id !== action.id) }

    case 'prepCheck':
      return {
        ...state,
        prepChecks: {
          ...state.prepChecks,
          [action.prepKey]: {
            ...(state.prepChecks[action.prepKey] || {}),
            [action.taskId]: !(state.prepChecks[action.prepKey] || {})[action.taskId],
          },
        },
      }

    case 'addStorage':
      return { ...state, storageItems: [{ id: uid(), ...action.item }, ...state.storageItems] }

    case 'addStorageBatch': {
      const existing = new Set(state.storageItems.map((i) => i.sourceId).filter(Boolean))
      const fresh = action.items.filter((i) => !i.sourceId || !existing.has(i.sourceId))
      if (!fresh.length) return state
      return {
        ...state,
        storageItems: [...fresh.map((i) => ({ id: uid(), ...i })), ...state.storageItems],
      }
    }

    case 'deleteStorage':
      return { ...state, storageItems: state.storageItems.filter((i) => i.id !== action.id) }

    case 'removeStorageBySource':
      return {
        ...state,
        storageItems: state.storageItems.filter((i) => i.sourceId !== action.sourceId),
      }

    case 'shoppingCheck':
      return {
        ...state,
        shoppingChecks: {
          ...state.shoppingChecks,
          [action.weekKey]: {
            ...(state.shoppingChecks[action.weekKey] || {}),
            [action.itemId]: !(state.shoppingChecks[action.weekKey] || {})[action.itemId],
          },
        },
      }

    case 'clearShopping':
      return { ...state, shoppingChecks: { ...state.shoppingChecks, [action.weekKey]: {} } }

    case 'theme':
      return { ...state, theme: action.theme }

    case 'portions':
      return { ...state, portions: Math.max(1, Math.min(8, action.portions)) }

    case 'prepDays':
      return { ...state, prepDays: [...action.prepDays].sort((a, b) => a - b) }

    case 'hidden':
      return { ...state, hidden: toggleIn(state.hidden, action.ingredientId) }

    case 'addWeighIn':
      return {
        ...state,
        weighIns: [{ id: uid(), dateKey: action.dateKey, weightKg: action.weightKg }, ...state.weighIns.filter((w) => w.dateKey !== action.dateKey)],
      }

    case 'deleteWeighIn':
      return { ...state, weighIns: state.weighIns.filter((w) => w.id !== action.id) }

    case 'reset':
      return { ...DEFAULT_STATE }

    default:
      return state
  }
}

export function StoreProvider({ children }) {
  // Load synchronously in the initialiser. Loading in an effect instead would
  // let the first save effect fire while state is still the default and
  // overwrite the stored data before it had been read back in.
  // loadState() never throws, so this is safe during render.
  const [state, dispatch] = useReducer(reducer, null, loadState)
  const firstRun = useRef(true)

  useEffect(() => {
    if (firstRun.current) {
      firstRun.current = false
      return
    }
    saveState(state)
  }, [state])

  return (
    <StateCtx.Provider value={state}>
      <DispatchCtx.Provider value={dispatch}>{children}</DispatchCtx.Provider>
    </StateCtx.Provider>
  )
}

export function useStore() {
  const ctx = useContext(StateCtx)
  if (!ctx) throw new Error('useStore must be used inside StoreProvider')
  return ctx
}

export function useDispatch() {
  const ctx = useContext(DispatchCtx)
  if (!ctx) throw new Error('useDispatch must be used inside StoreProvider')
  return ctx
}

/** Daily calorie and macro targets derived from the profile. */
export function useTargets() {
  const { profile } = useStore()
  return useMemo(() => calcTargets(profile), [profile])
}
