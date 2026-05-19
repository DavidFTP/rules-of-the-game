import { useEffect, useRef } from 'react'

const P1_KEYS = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])
const P2_KEYS = new Set(['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'])
const ACTION_KEYS = new Set(['z', 'Z', 'r', 'R', 'e', 'E', 'Escape', 'Enter'])

/**
 * useKeyboard(onKey, active)
 * Calls onKey({ key, isP1, isP2, isAction }) on every relevant keydown.
 * Only fires when active === true.
 */
export function useKeyboard(onKey, active = true) {
  // Keep a stable ref to the callback so we don't re-subscribe on every render
  const cbRef = useRef(onKey)
  cbRef.current = onKey

  useEffect(() => {
    if (!active) return

    function handler(e) {
      const key = e.key
      const isP1     = P1_KEYS.has(key)
      const isP2     = P2_KEYS.has(key)
      const isAction = ACTION_KEYS.has(key)

      if (!isP1 && !isP2 && !isAction) return
      if (isP1 || isP2) e.preventDefault()

      cbRef.current({ key, isP1, isP2, isAction })
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active])
}