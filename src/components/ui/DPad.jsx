import React, { useRef, useEffect, useState } from 'react'
import styles from './DPad.module.css'

/**
 * DPad — renders arrow buttons and calls onMove(arrowKey).
 * That is ALL it does. No swipe logic. No keyboard logic.
 * Those live in useSwipe.js and useKeyboard.js.
 *
 * Props:
 *   onMove(arrowKey)  — called with ArrowUp/Down/Left/Right
 *   onAction()        — called when the centre button is pressed (Enter/E)
 *   label             — small label above the pad e.g. "P1"
 *   accentColor       — optional CSS colour for the buttons
 */
export default function DPad({ onMove, onAction, label, accentColor }) {
  return (
    <div className={styles.wrap}>
      {label && <span className={styles.label}>{label}</span>}
      <div className={styles.grid}>
        <PadBtn dir="ArrowUp"    onMove={onMove} accentColor={accentColor}
          style={{ gridColumn:2, gridRow:1 }}>▲</PadBtn>

        <PadBtn dir="ArrowLeft"  onMove={onMove} accentColor={accentColor}
          style={{ gridColumn:1, gridRow:2 }}>◀</PadBtn>

        {onAction
          ? <PadBtn dir="action" onMove={onAction} accentColor="#f5a623"
              style={{ gridColumn:2, gridRow:2, fontSize:13 }}>✦</PadBtn>
          : <div style={{ gridColumn:2, gridRow:2 }} />
        }

        <PadBtn dir="ArrowRight" onMove={onMove} accentColor={accentColor}
          style={{ gridColumn:3, gridRow:2 }}>▶</PadBtn>

        <PadBtn dir="ArrowDown"  onMove={onMove} accentColor={accentColor}
          style={{ gridColumn:2, gridRow:3 }}>▼</PadBtn>
      </div>
    </div>
  )
}

function PadBtn({ dir, onMove, accentColor, style, children }) {
  const [pressed, setPressed] = useState(false)
  const intervalRef = useRef(null)

  function fire()     { onMove?.(dir) }
  function startHold(){ setPressed(true);  fire(); intervalRef.current = setInterval(fire, 150) }
  function endHold()  { setPressed(false); clearInterval(intervalRef.current) }

  useEffect(() => () => clearInterval(intervalRef.current), [])

  return (
    <button
      className={`${styles.btn} ${pressed ? styles.btnPressed : ''}`}
      style={{ ...style, ...(accentColor ? { background: accentColor } : {}) }}
      onTouchStart={e => { e.preventDefault(); startHold() }}
      onTouchEnd={e   => { e.preventDefault(); endHold()   }}
      onTouchCancel={e=> { e.preventDefault(); endHold()   }}
      onMouseDown={startHold}
      onMouseUp={endHold}
      onMouseLeave={endHold}
    >
      {children}
    </button>
  )
}
