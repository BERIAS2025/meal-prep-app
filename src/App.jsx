import { useCallback, useEffect, useState } from 'react'
import { useStore } from './state/store.jsx'
import { todayKey } from './lib/date.js'
import { Onboarding } from './views/Onboarding.jsx'
import { TodayView } from './views/Today.jsx'
import { WeekView } from './views/Week.jsx'
import { ShoppingView } from './views/Shopping.jsx'
import { PrepView } from './views/Prep.jsx'
import { CravingsView } from './views/Cravings.jsx'
import { SettingsView } from './views/Settings.jsx'
import {
  IconBowl,
  IconLog,
  IconPrep,
  IconSettings,
  IconShop,
  IconToday,
  IconWeek,
} from './components/Icons.jsx'

const TABS = [
  { id: 'today', label: 'Today', icon: IconToday, title: 'Today' },
  { id: 'week', label: 'Week', icon: IconWeek, title: 'This week' },
  { id: 'shop', label: 'Shop', icon: IconShop, title: 'Shopping list' },
  { id: 'prep', label: 'Prep', icon: IconPrep, title: 'Prep & fridge' },
  { id: 'log', label: 'Log', icon: IconLog, title: 'Craving log' },
]

const SUBTITLES = {
  today: 'What to eat, when, and why',
  week: 'Seven days, editable',
  shop: 'Raw amounts to buy',
  prep: 'Cook ahead and eat-by dates',
  log: 'Patterns, not willpower',
  settings: 'Targets, rhythm and data',
}

export function App() {
  const state = useStore()
  const [tab, setTab] = useState('today')
  const [dateKey, setDateKey] = useState(() => todayKey())
  const [logOpen, setLogOpen] = useState(false)
  const [installEvent, setInstallEvent] = useState(null)
  const [updateReady, setUpdateReady] = useState(false)

  // Theme: explicit choice wins, otherwise follow the device.
  useEffect(() => {
    const root = document.documentElement
    if (state.theme === 'auto') root.removeAttribute('data-theme')
    else root.setAttribute('data-theme', state.theme)

    const dark =
      state.theme === 'dark' ||
      (state.theme === 'auto' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document
      .querySelector('meta[name="theme-color"]')
      ?.setAttribute('content', dark ? '#0e110f' : '#f6f5f1')
  }, [state.theme])

  // "Add to Home Screen" — Chrome fires this when the PWA is installable.
  useEffect(() => {
    const onPrompt = (e) => {
      e.preventDefault()
      setInstallEvent(e)
    }
    const onInstalled = () => setInstallEvent(null)
    window.addEventListener('beforeinstallprompt', onPrompt)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onPrompt)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  useEffect(() => {
    const onUpdate = () => setUpdateReady(true)
    window.addEventListener('mealplan:update-ready', onUpdate)
    return () => window.removeEventListener('mealplan:update-ready', onUpdate)
  }, [])

  const openDay = useCallback((key) => {
    setDateKey(key)
    setTab('today')
  }, [])

  if (!state.onboarded) return <Onboarding />

  const active = TABS.find((t) => t.id === tab)
  const heading = tab === 'settings' ? 'Settings' : active?.title

  return (
    <div className="app">
      <a className="skip-link" href="#main">
        Skip to content
      </a>

      <nav className="tabbar" aria-label="Main">
        <div className="tabbar__brand">
          <IconBowl size={22} />
          Meal plan
        </div>
        {TABS.map((t) => (
          <button
            key={t.id}
            type="button"
            className="tabbar__item"
            aria-current={tab === t.id ? 'page' : undefined}
            onClick={() => setTab(t.id)}
          >
            <t.icon size={21} />
            {t.label}
          </button>
        ))}
      </nav>

      <div className="app__col">
        <header className="topbar">
          <div className="topbar__title">
            <h1>{heading}</h1>
            <p>{SUBTITLES[tab]}</p>
          </div>
          {installEvent && (
            <button
              type="button"
              className="btn btn--sm btn--primary"
              onClick={async () => {
                installEvent.prompt()
                await installEvent.userChoice
                setInstallEvent(null)
              }}
            >
              Install
            </button>
          )}
          <button
            type="button"
            className="icon-btn"
            aria-pressed={tab === 'settings'}
            aria-label="Settings"
            onClick={() => setTab(tab === 'settings' ? 'today' : 'settings')}
          >
            <IconSettings />
          </button>
        </header>

        {updateReady && (
          <div style={{ padding: '10px 16px 0' }}>
            <div className="notice notice--info" role="status">
              <div style={{ flex: 1 }}>A new version is ready.</div>
              <button type="button" className="btn btn--sm" onClick={() => window.location.reload()}>
                Reload
              </button>
            </div>
          </div>
        )}

        <main className="main" id="main" tabIndex={-1}>
          {tab === 'today' && <TodayView dateKey={dateKey} setDateKey={setDateKey} />}
          {tab === 'week' && <WeekView onOpenDay={openDay} />}
          {tab === 'shop' && <ShoppingView />}
          {tab === 'prep' && <PrepView />}
          {tab === 'log' && <CravingsView logOpen={logOpen} setLogOpen={setLogOpen} />}
          {tab === 'settings' && <SettingsView />}
        </main>
      </div>

      {tab !== 'log' && (
        <button
          type="button"
          className="fab"
          onClick={() => {
            setTab('log')
            setLogOpen(true)
          }}
        >
          <IconLog size={19} />
          Craving
        </button>
      )}
    </div>
  )
}
