import { useState, useEffect } from 'react'

/**
 * useTouchDevice()
 *
 * Returns true once a real touchstart event has been detected.
 * This is the only reliable cross-browser way to know you're on a touch device.
 * CSS media queries like (pointer: coarse) are unreliable on many Android
 * browsers and WebViews — they can return false even on phones.
 *
 * The D-pad and touch controls render only when this returns true,
 * so desktop users never see them.
 */
export function useTouchDevice() {
  const [isTouch, setIsTouch] = useState(false)

  useEffect(() => {
    if (isTouch) return
    function onFirstTouch() { setIsTouch(true) }
    window.addEventListener('touchstart', onFirstTouch, { once: true, passive: true })
    return () => window.removeEventListener('touchstart', onFirstTouch)
  }, [isTouch])

  return isTouch
}
