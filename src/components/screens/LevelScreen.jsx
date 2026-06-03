import React, { useEffect, useState, useRef } from 'react'
import GameBoard   from '../canvas/GameBoard.jsx'
import TopStrip    from '../layout/TopStrip.jsx'
import BottomStrip from '../layout/BottomStrip.jsx'
import DPad        from '../ui/DPad.jsx'
import Modal       from '../ui/Modal.jsx' // Make sure you have this base modal imported
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
 * - Owns the scene layout (TopStrip / canvas / BottomStrip / D-pad)
 * - Owns modal visibility state (win, round-win, crack-lose, tutorial)
 * - Wires useGameEngine (logic) → GameBoard (draw) → DPad + useSwipe (input)
 */
export default function LevelScreen({ levelNum, onHub }) {
  const levelData     = LEVELS[levelNum]
  const canvasAreaRef = useRef(null)
  const isTouch       = useTouchDevice()

  const [showLevelWin,   setShowLevelWin]   = useState(false)
  const [showRoundWin,   setShowRoundWin]   = useState(false)
  const [showCrack,      setShowCrack]      = useState(false)
  const [showTutorial,   setShowTutorial]   = useState(false) // <-- New State
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

      <div className={styles.canvasArea} ref={canvasAreaRef} style={{ position: 'relative' }}>
        <GameBoard state={state} />

        {/* --- TUTORIAL BUTTON --- */}
        {config?.hasTutorialButton && (
          <button 
            onClick={() => setShowTutorial(true)}
            style={{
              position: 'absolute',
              top: '10px',
              right: '10px',
              padding: '8px 16px',
              backgroundColor: 'var(--theme-primary, #333)',
              color: '#fff',
              border: '2px solid rgba(255,255,255,0.3)',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: 'bold',
              zIndex: 10,
              boxShadow: '0 4px 6px rgba(0,0,0,0.3)'
            }}
          >
            ❓ Read Rules
          </button>
        )}

        {/* --- TUTORIAL MODAL --- */}
        {showTutorial && (
          <Modal title="Level Rules" onClose={() => setShowTutorial(false)}>
            <div style={{ textAlign: 'right', direction: 'rtl', padding: '10px', lineHeight: '1.8' }}>
              {config.tutorialSegments?.map((seg, i) => (
                <p key={i} style={{ margin: '0 0 10px 0', fontSize: '1.1rem', color: seg.includes('⚠️') ? 'red' : 'inherit' }}>
                  {seg}
                </p>
              ))}
              <button 
                onClick={() => setShowTutorial(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '10px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
              >
                I Understand the Secret!
              </button>
            </div>
          </Modal>
        )}

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