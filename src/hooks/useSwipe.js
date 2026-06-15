import { useEffect, useRef } from 'react'

const THRESHOLD = 28
const REPEAT_MS = 150

/**
 * useSwipe(targetRef, onSwipe)
 *
 * Attaches touchstart/touchmove/touchend listeners to targetRef.current.
 * - Swipe + hold: fires onSwipe(direction) immediately and repeats every 150ms
 * - Change direction while holding: direction updates after crossing THRESHOLD px
 * - Lift finger: stops
 * Calls onSwipe('ArrowUp'|'ArrowDown'|'ArrowLeft'|'ArrowRight').
 * No JSX. No rendering.
 */
export function useSwipe(targetRef, onSwipe) {
  const checkpointRef = useRef(null)
  const dirRef        = useRef(null)
  const intervalRef   = useRef(null)
  const cbRef         = useRef(onSwipe)
  cbRef.current       = onSwipe

  function getDir(dx, dy) {
    if (Math.abs(dx) > Math.abs(dy)) {
      return dx > 0 ? 'ArrowRight' : 'ArrowLeft'
    }
    return dy > 0 ? 'ArrowDown' : 'ArrowUp'
  }

  function startRepeat(dir) {
    stopRepeat()
    dirRef.current = dir
    cbRef.current?.(dir)
    intervalRef.current = setInterval(() => cbRef.current?.(dir), REPEAT_MS)
  }

  function stopRepeat() {
    dirRef.current = null
    if (intervalRef.current) {
      clearInterval(intervalRef.current)
      intervalRef.current = null
    }
  }

  useEffect(() => {
    const el = targetRef?.current
    if (!el) return

    function onTouchStart(e) {
      const t = e.touches[0]
      checkpointRef.current = { x: t.clientX, y: t.clientY }
    }

    function onTouchMove(e) {
      const cp = checkpointRef.current
      if (!cp) return
      const t  = e.touches[0]
      const dx = t.clientX - cp.x
      const dy = t.clientY - cp.y

      if (Math.max(Math.abs(dx), Math.abs(dy)) < THRESHOLD) return

      const newDir = getDir(dx, dy)
      if (newDir !== dirRef.current) {
        checkpointRef.current = { x: t.clientX, y: t.clientY }
        startRepeat(newDir)
      }
    }

    function onTouchEnd() {
      stopRepeat()
      checkpointRef.current = null
    }

    el.addEventListener('touchstart', onTouchStart, { passive: true })
    el.addEventListener('touchmove',  onTouchMove,  { passive: true })
    el.addEventListener('touchend',   onTouchEnd,   { passive: true })
    el.addEventListener('touchcancel', onTouchEnd,  { passive: true })
    return () => {
      el.removeEventListener('touchstart', onTouchStart)
      el.removeEventListener('touchmove',  onTouchMove)
      el.removeEventListener('touchend',   onTouchEnd)
      el.removeEventListener('touchcancel', onTouchEnd)
      stopRepeat()
    }
  }, [targetRef])
}
