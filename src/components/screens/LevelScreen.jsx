import { useState, useRef, useEffect } from 'react'
import GameBoard   from '../canvas/GameBoard.jsx'
import { useAssets } from '../../contexts/AssetContext.jsx'
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
  const { images } = useAssets()

  const [showLevelWin,   setShowLevelWin]   = useState(false)
  const [showRoundWin,   setShowRoundWin]   = useState(false)
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
    activatePowerup,
  } = useGameEngine(levelNum, {
    onRoundWin: (idx) => { setCompletedRound(idx); setTimeout(() => setShowRoundWin(true), 500) },
    onLevelWin: ()    => { setTimeout(() => setShowLevelWin(true), 500) },
    onEscapeRequest: onHub,
  })

  const showCrack = !!state?._crackLose

  // Swipe anywhere on the canvas moves P1
  useSwipe(canvasAreaRef, (arrowKey) => handleMove?.(arrowKey, 'playerPos'))

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
        <GameBoard state={state} images={images} />
        
        {/* --- SIMON SAYS LOSE MODAL --- */}
        {state?._showSimonLose && (
          <Modal title="❌ Disobeyed Instructions" onClose={() => {}}>
            <div style={{ textAlign: 'center', padding: '10px', lineHeight: '1.8', direction: 'ltr' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                You solved the puzzle, but you did it <strong>your own way</strong> instead of following the instructions!
              </p>
              <p style={{ fontSize: '1.1rem', color: '#ffbbbb' }}>
                Just like Naaman, we must learn to obey God's word exactly, even when it seems like meaningless extra steps.
              </p>
              <button 
                onClick={handleRestart}
                style={{
                  width: '100%', padding: '12px', marginTop: '20px',
                  backgroundColor: '#e94560', color: 'white', border: 'none',
                  borderRadius: '6px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                ↻ Restart and Obey
              </button>
            </div>
          </Modal>
        )}

        {isTouch && (
          <>
            <div className={styles.escButton}>
              <button
                className={styles.iconBtn}
                onTouchStart={e => { e.preventDefault(); onHub() }}
                onMouseDown={onHub}
                aria-label="Return to hub"
              >
                ⌂
              </button>
            </div>
            <div className={styles.topRightButtons}>
              <button
                className={styles.iconBtn}
                onTouchStart={e => { e.preventDefault(); handleUndo?.() }}
                onMouseDown={handleUndo}
                aria-label="Undo"
              >
                ↩
              </button>
              <button
                className={styles.iconBtn}
                onTouchStart={e => { e.preventDefault(); handleRestart() }}
                onMouseDown={handleRestart}
                aria-label="Restart"
              >
                ↺
              </button>
            </div>
            {isCoop ? (
              <div className={styles.touchControlsCoop}>
                <div className={styles.padSide}>
                  <DPad
                    compact
                    label="P2"
                    accentColor="#1a7a1a"
                    onMove={(k) => handleMove?.(k, 'player2Pos')}
                  />
                </div>
                <div className={styles.padSide}>
                  <DPad
                    compact
                    label="P1"
                    onMove={(k) => handleMove?.(k, 'playerPos')}
                  />
                </div>
              </div>
            ) : (
              <div className={styles.touchControls}>
                <DPad
                  compact
                  label="P1"
                  onMove={(k) => handleMove?.(k, 'playerPos')}
                />
              </div>
            )}
          </>
        )}

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
            onRetry={handleRestart}
            onHub={onHub}
          />
        )}
      </div>
      
      {/* --- DYNAMIC POWERUP MENU --- */}
      {config?.powerups && state?.isFinalRound && (
        <div style={{ 
          display: 'flex', gap: '10px', justifyContent: 'center', 
          padding: '10px', background: 'rgba(0,0,0,0.8)', borderTop: '2px solid #444' 
        }}>
          {config.powerups.map(pwr => {
            const isActive = state.activePowerups?.includes(pwr.id);
            const canAfford = (state.tokens || 0) >= pwr.cost;
            return (
              <button 
                key={pwr.id}
                onClick={() => activatePowerup(pwr.id, pwr.cost)}
                disabled={isActive || !canAfford}
                style={{
                  padding: '8px 12px',
                  borderRadius: '6px',
                  border: isActive ? '2px solid #4CAF50' : (canAfford ? '2px solid #FFD700' : '2px solid #555'),
                  backgroundColor: isActive ? '#1b4a1b' : '#222',
                  color: isActive ? '#4CAF50' : (canAfford ? '#fff' : '#777'),
                  cursor: (isActive || !canAfford) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {pwr.name} <br/>
                <span style={{ fontSize: '0.8rem', fontWeight: 'normal' }}>({pwr.cost} 🪙)</span>
              </button>
            )
          })}
        </div>
      )}

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
    </div>
  )
}