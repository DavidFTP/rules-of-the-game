import { useEffect, useRef } from 'react'

const P1_KEYS     = new Set(['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'])
const P2_KEYS     = new Set(['w', 'a', 's', 'd', 'W', 'A', 'S', 'D'])
const ACTION_KEYS = new Set(['z', 'Z', 'r', 'R', 'e', 'E', 'Escape', 'Enter'])

// Tags that should NEVER have game keys intercepted
const INPUT_TAGS = new Set(['INPUT', 'TEXTAREA', 'SELECT'])

/**
 * useKeyboard(onKey, active)
 * Calls onKey({ key, isP1, isP2, isAction }) on every relevant keydown.
 * Automatically pauses when the focused element is a text input,
 * so modal answer fields always receive normal typing.
 */
export function useKeyboard(onKey, active = true) {
  const cbRef = useRef(onKey)
  cbRef.current = onKey

  useEffect(() => {
    if (!active) return

    function handler(e) {
      // Never intercept while the user is typing in an input/textarea
      if (INPUT_TAGS.has(document.activeElement?.tagName)) return

      const key      = e.key
      const isP1     = P1_KEYS.has(key)
      const isP2     = P2_KEYS.has(key)
      const isAction = ACTION_KEYS.has(key)

      if (!isP1 && !isP2 && !isAction) return
      // Only preventDefault for movement keys, not letters used in modals
      if (isP1) e.preventDefault()

      cbRef.current({ key, isP1, isP2, isAction })
    }

    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [active])
}
