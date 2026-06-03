import React, { useEffect, useState, useRef } from 'react'
import GameBoard   from '../canvas/GameBoard.jsx'
import TopStrip    from '../layout/TopStrip.jsx'
import BottomStrip from '../layout/BottomStrip.jsx'
import DPad        from '../ui/DPad.jsx'
import { WinModal, CrackLoseModal, ComingSoonModal, RoundWinModal } from '../ui/GameModals.jsx'
import { useGameEngine }  from '../../hooks/useGameEngine.js'
import { useTokens }      from '../../hooks/useTokens.js'
import { useSwipe }       from '../../hooks/useSwipe.js'
import { useTouchDevice } from '../../hooks/useTouchDevice.js'
import LEVELS from '../../levels/index.js'
import styles from './LevelScreen.module.css'

/**
 * LevelScreen — the full level page.
 *
 * Responsibilities:
 *   - Owns the scene layout (TopStrip / canvas / BottomStrip / D-pad)
 *   - Owns modal visibility state (win, round-win, crack-lose)
 *   - Wires useGameEngine (logic) → GameBoard (draw) → DPad + useSwipe (input)
 */
export default function LevelScreen({ levelNum, onHub }) {
  const levelData     = LEVELS[levelNum]
  const canvasAreaRef = useRef(null)
  const isTouch       = useTouchDevice()

  const [showLevelWin,   setShowLevelWin]   = useState(false)
  const [showRoundWin,   setShowRoundWin]   = useState(false)
  const [showCrack,      setShowCrack]      = useState(false)
  const [completedRound, setCompletedRound] = useState(null)

  const { bag, buy, purchases } = useTokens()

  const {
    state,
    restarts,
    roundIndex,
    totalRounds,
    carriedTokens,
    advanceRound,
    handleRestart,
    handleMove,
    handleUndo,
  } = useGameEngine(levelNum, {
    onRoundWin: (idx) => { setCompletedRound(idx); setTimeout(() => setShowRoundWin(true), 500) },
    onLevelWin: ()    => { setTimeout(() => setShowLevelWin(true), 500) },
  })

  // Swipe anywhere on the canvas moves P1
  useSwipe(canvasAreaRef, (arrowKey) => handleMove?.(arrowKey, 'playerPos'))

  useEffect(() => {
    if (state?._crackLose) setShowCrack(true)
  }, [state?._crackLose])

  if (!levelData) {
    return (
      <div className={styles.wrap}>
        <div className={styles.canvasArea}>
          <ComingSoonModal levelNum={levelNum} onHub={onHub} />
        </div>
      </div>
    )
  }

  const config = levelData.config
  const isCoop = !!config?.coop

  return (
    <div className={styles.wrap}>
      <TopStrip
        config={config}
        state={state}
        levelNum={levelNum}
        restarts={restarts}
        roundIndex={roundIndex}
        totalRounds={totalRounds}
      />

      <div className={styles.canvasArea} ref={canvasAreaRef}>
        <GameBoard state={state} />

        {showRoundWin && !showLevelWin && (
          <RoundWinModal
            roundNum={completedRound + 1}
            totalRounds={totalRounds}
            tokens={carriedTokens}
            onNext={() => { setShowRoundWin(false); setCompletedRound(null); advanceRound() }}
            onHub={onHub}
          />
        )}
        {showLevelWin && (
          <WinModal
            levelNum={levelNum}
            tokens={carriedTokens}
            onHub={() => { setShowLevelWin(false); onHub() }}
          />
        )}
        {showCrack && (
          <CrackLoseModal
            onRetry={() => { setShowCrack(false); handleRestart() }}
            onHub={() => { setShowCrack(false); onHub() }}
          />
        )}
      </div>

      <BottomStrip
        config={config}
        state={state}
        tokenBag={bag}
        purchases={purchases}
        onBuy={buy}
        roundIndex={roundIndex}
        totalRounds={totalRounds}
        carriedTokens={carriedTokens}
      />

      {isTouch && (
        <div className={styles.touchRow}>
          <DPad
            label="P1"
            onMove={(k) => handleMove?.(k, 'playerPos')}
          />
          {isCoop && (
            <DPad
              label="P2"
              accentColor="#1a7a1a"
              onMove={(k) => handleMove?.(k, 'player2Pos')}
            />
          )}
          <div className={styles.actionBtns}>
            <button className={styles.actionBtn}
              onTouchStart={e=>{e.preventDefault(); handleUndo?.()}}
              onMouseDown={handleUndo}>
              <span>↩</span><span>Undo</span>
            </button>
            <button className={styles.actionBtn}
              onTouchStart={e=>{e.preventDefault(); handleRestart()}}
              onMouseDown={handleRestart}>
              <span>↺</span><span>Restart</span>
            </button>
            <button className={styles.actionBtn}
              onTouchStart={e=>{e.preventDefault(); onHub()}}
              onMouseDown={onHub}>
              <span>⌂</span><span>Hub</span>
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
