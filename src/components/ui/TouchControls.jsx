import React, { useRef, useCallback, useEffect } from 'react'
import styles from './TouchControls.module.css'

/**
 * TouchControls
 *
 * Renders on touch devices only. Two modes:
 *   - Swipe detection on the game canvas area (swipeTarget ref)
 *   - On-screen D-pad buttons as fallback / primary for small screens
 *
 * Props:
 *   onMove(key)          — called with 'ArrowUp' | 'ArrowDown' | 'ArrowLeft' | 'ArrowRight'
 *   onUndo()
 *   onRestart()
 *   onHub()
 *   showP2              — show second set of WASD-style buttons for co-op
 *   onMoveP2(key)
 */
export default function TouchControls({
  onMove,
  onUndo,
  onRestart,
  onHub,
  showP2 = false,
  onMoveP2,
}) {
  const touchStartRef = useRef(null)
  const SWIPE_THRESHOLD = 30  // px

  // Swipe detection on the whole canvas area
  function handleTouchStart(e) {
    const t = e.touches[0]
    touchStartRef.current = { x: t.clientX, y: t.clientY }
  }

  function handleTouchEnd(e) {
    if (!touchStartRef.current) return
    const t   = e.changedTouches[0]
    const dx  = t.clientX - touchStartRef.current.x
    const dy  = t.clientY - touchStartRef.current.y
    const adx = Math.abs(dx)
    const ady = Math.abs(dy)

    if (Math.max(adx, ady) < SWIPE_THRESHOLD) return  // tap, not swipe

    if (adx > ady) {
      onMove?.(dx > 0 ? 'ArrowRight' : 'ArrowLeft')
    } else {
      onMove?.(dy > 0 ? 'ArrowDown' : 'ArrowUp')
    }
    touchStartRef.current = null
  }

  // Expose touch handlers on the canvas wrapper via data attributes
  // (the parent LevelScreen attaches them to the canvas area div)
  useEffect(() => {
    const area = document.getElementById('canvas-touch-area')
    if (!area) return
    area.addEventListener('touchstart', handleTouchStart, { passive: true })
    area.addEventListener('touchend',   handleTouchEnd)
    return () => {
      area.removeEventListener('touchstart', handleTouchStart)
      area.removeEventListener('touchend',   handleTouchEnd)
    }
  })

  return (
    <div className={styles.wrap}>
      {/* Action row */}
      <div className={styles.actionRow}>
        <ActionBtn label="↩ Undo"    onClick={onUndo}    />
        <ActionBtn label="↺ Restart" onClick={onRestart} />
        <ActionBtn label="⌂ Hub"     onClick={onHub}     />
      </div>

      {/* D-pads row */}
      <div className={styles.padsRow}>
        <DPad label="P1" onMove={onMove} />
        {showP2 && <DPad label="P2" onMove={onMoveP2} color="#1a7a1a" />}
      </div>
    </div>
  )
}

function DPad({ label, onMove, color }) {
  function press(dir) {
    return (e) => { e.preventDefault(); onMove?.(dir) }
  }
  return (
    <div className={styles.dpadWrap}>
      <span className={styles.dpadLabel}>{label}</span>
      <div className={styles.dpad}>
        <button className={styles.dpadBtn} style={{ gridColumn:2, gridRow:1, ...(color ? {background:color} : {}) }}
          onTouchStart={press('ArrowUp')}    onMouseDown={press('ArrowUp')}>▲</button>
        <button className={styles.dpadBtn} style={{ gridColumn:1, gridRow:2, ...(color ? {background:color} : {}) }}
          onTouchStart={press('ArrowLeft')}  onMouseDown={press('ArrowLeft')}>◀</button>
        <div style={{ gridColumn:2, gridRow:2, background:'rgba(255,255,255,0.05)', borderRadius:4 }} />
        <button className={styles.dpadBtn} style={{ gridColumn:3, gridRow:2, ...(color ? {background:color} : {}) }}
          onTouchStart={press('ArrowRight')} onMouseDown={press('ArrowRight')}>▶</button>
        <button className={styles.dpadBtn} style={{ gridColumn:2, gridRow:3, ...(color ? {background:color} : {}) }}
          onTouchStart={press('ArrowDown')}  onMouseDown={press('ArrowDown')}>▼</button>
      </div>
    </div>
  )
}

function ActionBtn({ label, onClick }) {
  return (
    <button className={styles.actionBtn} onTouchStart={e => { e.preventDefault(); onClick?.() }} onMouseDown={onClick}>
      {label}
    </button>
  )
}
