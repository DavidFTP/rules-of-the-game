import { useEffect, useRef } from 'react'

/**
 * useSwipe(targetRef, onSwipe)
 *
 * Attaches touchstart/touchend listeners to targetRef.current.
 * Calls onSwipe('ArrowUp'|'ArrowDown'|'ArrowLeft'|'ArrowRight').
 * Lives in /hooks because it is a bridge: DOM events → engine calls.
 * No JSX. No rendering.
 */
export function useSwipe(targetRef, onSwipe) {
  const startRef = useRef(null)
  const cbRef    = useRef(onSwipe)
  cbRef.current  = onSwipe

  useEffect(() => {
    const el = targetRef?.current
    if (!el) return

    function onTouchStart(e) {
      const t = e.touches[0]
      startRef.current = { x: t.clientX, y: t.clientY }
    }

    function onTouchEnd(e) {
      if (!startRef.current) return
      const t  = e.changedTouches[0]
      const dx = t.clientX - startRef.current.x
      const dy = t.clientY - startRef.current.y
      startRef.current = null

      if (Math.max(Math.abs(dx), Math.abs(dy)) < 28) return

      if (Math.abs(dx) > Math.abs(dy)) {
        cbRef.current?.(dx > 0 ? 'ArrowRight' : 'ArrowLeft')
      } else {
        cbRef.current?.(dy > 0 ? 'ArrowDown' : 'ArrowUp')
      }
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchend',   onTouchEnd)
    }
  }, [targetRef])
}
