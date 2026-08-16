/** Inline icons — no icon package, nothing to fetch, works offline. */

const base = {
  width: 20,
  height: 20,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.9,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

const Icon = ({ children, size, ...rest }) => (
  <svg {...base} {...(size ? { width: size, height: size } : null)} {...rest}>
    {children}
  </svg>
)

export const IconToday = (p) => (
  <Icon {...p}>
    <path d="M3 11h18" />
    <path d="M5 11a7 7 0 0 1 14 0" />
    <path d="M4 15h16" />
    <path d="M6 19h12" />
  </Icon>
)

export const IconWeek = (p) => (
  <Icon {...p}>
    <rect x="3" y="4.5" width="18" height="16" rx="3" />
    <path d="M3 9.5h18M8 2.5v4M16 2.5v4" />
    <path d="M7.5 13.5h3M13.5 13.5h3M7.5 17h3" />
  </Icon>
)

export const IconShop = (p) => (
  <Icon {...p}>
    <path d="M5.5 8h13l-1.1 11.1a2 2 0 0 1-2 1.9H8.6a2 2 0 0 1-2-1.9L5.5 8Z" />
    <path d="M9 8V6.2a3 3 0 0 1 6 0V8" />
  </Icon>
)

export const IconPrep = (p) => (
  <Icon {...p}>
    <path d="M4 10.5h16" />
    <path d="M5.5 10.5v6.2a3 3 0 0 0 3 3h7a3 3 0 0 0 3-3v-6.2" />
    <path d="M8.5 7.2c0-1.8 1.6-3.2 3.5-3.2s3.5 1.4 3.5 3.2" />
    <path d="M3 20.5h18" />
  </Icon>
)

export const IconLog = (p) => (
  <Icon {...p}>
    <path d="M12 20.5S4.5 15.6 4.5 10.2A4.2 4.2 0 0 1 12 7.6a4.2 4.2 0 0 1 7.5 2.6c0 5.4-7.5 10.3-7.5 10.3Z" />
  </Icon>
)

export const IconSettings = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="3.1" />
    <path d="M19.4 14.5a1.6 1.6 0 0 0 .32 1.77l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.6 1.6 0 0 0-1.77-.32 1.6 1.6 0 0 0-.97 1.47V21a2 2 0 0 1-4 0v-.1a1.6 1.6 0 0 0-1.05-1.47 1.6 1.6 0 0 0-1.77.32l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.6 1.6 0 0 0 .32-1.77 1.6 1.6 0 0 0-1.47-.97H3a2 2 0 0 1 0-4h.1a1.6 1.6 0 0 0 1.47-1.05 1.6 1.6 0 0 0-.32-1.77l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.6 1.6 0 0 0 1.77.32H9a1.6 1.6 0 0 0 .97-1.47V3a2 2 0 0 1 4 0v.1a1.6 1.6 0 0 0 .97 1.47 1.6 1.6 0 0 0 1.77-.32l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.6 1.6 0 0 0-.32 1.77V9a1.6 1.6 0 0 0 1.47.97H21a2 2 0 0 1 0 4h-.1a1.6 1.6 0 0 0-1.47.97Z" />
  </Icon>
)

export const IconSwap = (p) => (
  <Icon {...p}>
    <path d="M4 8h13l-3-3M20 16H7l3 3" />
  </Icon>
)

export const IconInfo = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 11v5M12 7.6h.01" />
  </Icon>
)

export const IconCheck = (p) => (
  <Icon {...p}>
    <path d="M4.5 12.5 9.5 17.5 19.5 7" />
  </Icon>
)

export const IconClose = (p) => (
  <Icon {...p}>
    <path d="M6 6 18 18M18 6 6 18" />
  </Icon>
)

export const IconPlus = (p) => (
  <Icon {...p}>
    <path d="M12 5v14M5 12h14" />
  </Icon>
)

export const IconChevronLeft = (p) => (
  <Icon {...p}>
    <path d="M14.5 5.5 8 12l6.5 6.5" />
  </Icon>
)

export const IconChevronRight = (p) => (
  <Icon {...p}>
    <path d="M9.5 5.5 16 12l-6.5 6.5" />
  </Icon>
)

export const IconClock = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="9" />
    <path d="M12 7v5.2l3.2 2" />
  </Icon>
)

export const IconAlert = (p) => (
  <Icon {...p}>
    <path d="M10.3 3.9 2.5 17.4A2 2 0 0 0 4.2 20.5h15.6a2 2 0 0 0 1.7-3.1L13.7 3.9a2 2 0 0 0-3.4 0Z" />
    <path d="M12 9.5v4M12 16.8h.01" />
  </Icon>
)

export const IconMoon = (p) => (
  <Icon {...p}>
    <path d="M20 14.2A8.4 8.4 0 0 1 9.8 4 8.4 8.4 0 1 0 20 14.2Z" />
  </Icon>
)

export const IconSun = (p) => (
  <Icon {...p}>
    <circle cx="12" cy="12" r="4" />
    <path d="M12 2.5v2M12 19.5v2M4.4 4.4l1.4 1.4M18.2 18.2l1.4 1.4M2.5 12h2M19.5 12h2M4.4 19.6l1.4-1.4M18.2 5.8l1.4-1.4" />
  </Icon>
)

export const IconTrash = (p) => (
  <Icon {...p}>
    <path d="M4 6.5h16M9.5 6.5V4.8a1.3 1.3 0 0 1 1.3-1.3h2.4a1.3 1.3 0 0 1 1.3 1.3v1.7" />
    <path d="M6.5 6.5 7.4 19a2 2 0 0 0 2 1.9h5.2a2 2 0 0 0 2-1.9l.9-12.5" />
  </Icon>
)

export const IconDownload = (p) => (
  <Icon {...p}>
    <path d="M12 3.5v11M7.5 10.5 12 15l4.5-4.5" />
    <path d="M4 17v1.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V17" />
  </Icon>
)

export const IconUpload = (p) => (
  <Icon {...p}>
    <path d="M12 15V4M7.5 8 12 3.5 16.5 8" />
    <path d="M4 17v1.5a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V17" />
  </Icon>
)

export const IconFlame = (p) => (
  <Icon {...p}>
    <path d="M12 3s4.8 3.6 4.8 8.2a4.8 4.8 0 0 1-9.6 0C7.2 9.5 8.6 8 8.6 8s.4 1.6 1.6 2c0-2.6 1.8-5.4 1.8-7Z" />
  </Icon>
)

export const IconBowl = (p) => (
  <Icon {...p}>
    <path d="M3.5 10.5h17a8.5 8.5 0 0 1-8.5 8.5 8.5 8.5 0 0 1-8.5-8.5Z" />
    <path d="M8.5 7.2c0-1.4 1-2.2 1-3.2M12 7.2c0-1.4 1-2.2 1-3.2M15.5 7.2c0-1.4 1-2.2 1-3.2" />
  </Icon>
)

export const IconDumbbell = (p) => (
  <Icon {...p}>
    <path d="M4 9.5v5M7 7.5v9M17 7.5v9M20 9.5v5M7 12h10" />
  </Icon>
)

export const IconRun = (p) => (
  <Icon {...p}>
    <circle cx="14.5" cy="4.7" r="1.8" />
    <path d="M13 20.5l1.6-4.6-3.2-2.6.9-4.6 3.3 3.2 3 .8" />
    <path d="M12.3 8.7 8.6 10l-1 3M8.4 15.4l-2.9 5" />
  </Icon>
)

export const IconRest = (p) => (
  <Icon {...p}>
    <path d="M13.5 3.5h6l-6 7h6" />
    <path d="M4.5 13.5h5l-5 6h5" />
  </Icon>
)
