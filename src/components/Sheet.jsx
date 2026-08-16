import { useEffect, useId, useRef } from 'react'
import { createPortal } from 'react-dom'
import { IconClose } from './Icons.jsx'

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])'

/**
 * Bottom sheet on phones, centred dialog from 700px up.
 * Traps focus, closes on Escape and on backdrop click, and hands focus back
 * to whatever opened it.
 */
export function Sheet({ open, onClose, title, subtitle, children, footer, wide }) {
  const ref = useRef(null)
  const restoreTo = useRef(null)
  const titleId = useId()
  const descId = useId()

  useEffect(() => {
    if (!open) return
    restoreTo.current = document.activeElement

    const node = ref.current
    const first = node?.querySelector(FOCUSABLE)
    ;(first || node)?.focus()

    const onKeyDown = (e) => {
      if (e.key === 'Escape') {
        e.stopPropagation()
        onClose()
        return
      }
      if (e.key !== 'Tab' || !node) return
      const items = [...node.querySelectorAll(FOCUSABLE)].filter((el) => el.offsetParent !== null)
      if (!items.length) return
      const firstEl = items[0]
      const lastEl = items[items.length - 1]
      if (e.shiftKey && document.activeElement === firstEl) {
        e.preventDefault()
        lastEl.focus()
      } else if (!e.shiftKey && document.activeElement === lastEl) {
        e.preventDefault()
        firstEl.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown, true)
    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.removeEventListener('keydown', onKeyDown, true)
      document.body.style.overflow = prevOverflow
      // The element that opened the sheet may have been re-rendered away by the
      // action taken inside it (swapping an ingredient replaces the row). Fall
      // back to the main landmark so focus never lands on <body>.
      const el = restoreTo.current
      const target =
        el && document.contains(el) && typeof el.focus === 'function'
          ? el
          : document.getElementById('main')
      target?.focus()
    }
  }, [open, onClose])

  if (!open) return null

  return createPortal(
    <>
      <div className="backdrop" onClick={onClose} />
      <div
        className="sheet"
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={subtitle ? descId : undefined}
        ref={ref}
        tabIndex={-1}
        style={wide ? { maxWidth: 'min(720px, calc(100vw - 48px))' } : undefined}
      >
        <div className="sheet__head">
          <div style={{ flex: 1, minWidth: 0 }}>
            <h2 id={titleId}>{title}</h2>
            {subtitle && <p id={descId}>{subtitle}</p>}
          </div>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Close">
            <IconClose />
          </button>
        </div>
        <div className="sheet__body">{children}</div>
        {footer && <div className="sheet__foot">{footer}</div>}
      </div>
    </>,
    document.body,
  )
}
