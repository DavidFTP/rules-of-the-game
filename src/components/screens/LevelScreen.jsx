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
  const [showModeSelect, setShowModeSelect] = useState(false);
  const [coopMode, setCoopMode] = useState(true);

  const { bag, buy, purchases } = useTokens()

  // 1. Get the game state hook
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

  // 2. Safely grab the config from the CURRENT state (which merges the round config)
  const currentConfig = state?.config || levelData?.config;

  // 3. Trigger the modal when the level loads, with DEBUG LOGS
  useEffect(() => {
    if (currentConfig?.requiresPlayerSelection && roundIndex === 0 && restarts === 0) {
      console.log('✅ Showing Mode Select Modal!');
      setShowModeSelect(true);
    }
  }, [currentConfig, roundIndex, restarts]);

  useEffect(() => {
    if (state && !coopMode) {
      if (state.config) state.config.coop = false; // Tell logic.js it's solo
      state.player2Pos = null; // Delete Player 2 coordinates from the engine
    }
  }, [state, coopMode]);

  // Create a safe copy of state for the GameBoard to ensure P2 is hidden visually
  const displayState = state ? {
    ...state,
    player2Pos: coopMode ? state.player2Pos : null
  } : null;
  // ==========================================
  
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
  // Change this line so it respects your coopMode state!
  const isCoop = !!currentConfig?.coop && coopMode;

  return (
    <div className={styles.wrap}>
      <TopStrip
        config={config}
        state={state}
        levelNum={levelNum}
        restarts={restarts}
        roundIndex={roundIndex}
        totalRounds={totalRounds}
        onTutorialClick={() => setShowTutorial(true)} // 👈 ADD THIS
      />

      <div className={styles.canvasArea} ref={canvasAreaRef} style={{ position: 'relative' }}>
        
        {/* Pass displayState here instead of state */}
        <GameBoard state={displayState} images={images} />
        
        {/* --- 1P / 2P SELECTION MODAL --- */}
        {showModeSelect && (
          <Modal title="Choose Game Mode" onClose={() => {}}>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                How do you want to play this level?
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                  onClick={() => { setCoopMode(false); setShowModeSelect(false); }}
                  style={{ padding: '12px 20px', backgroundColor: '#4a90e2', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  👤 1 Player (Solo)
                </button>
                <button 
                  onClick={() => { setCoopMode(true); setShowModeSelect(false); }}
                  style={{ padding: '12px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  👥 2 Players (Co-op)
                </button>
              </div>
            </div>
          </Modal>
        )}

        {/* --- INCORRECT ORDER LOSE MODAL --- */}
        {state?._showOrderLose && (
          <Modal title="❌ Incorrect Order!" onClose={() => {}}>
            <div style={{ textAlign: 'center', padding: '10px', lineHeight: '1.8' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#ffbbbb' }}>
                {state.orderLoseMessage}
              </p>
              <button 
                onClick={handleRestart}
                style={{
                  width: '100%', padding: '12px', marginTop: '20px',
                  backgroundColor: '#e94560', color: 'white', border: 'none',
                  borderRadius: '6px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                ↻ Restart Round
              </button>
            </div>
          </Modal>
        )}
        
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

        {/* --- TUTORIAL MODAL --- */}
        {showTutorial && (
          <Modal onClose={() => setShowTutorial(false)}>
            {/* Inner wrapper to strictly control size, border, and background */}
            <div style={{ 
              maxWidth: '420px',           // Makes the modal significantly smaller
              margin: '0 auto',            // Centers it inside the parent modal box
              border: '4px solid #FFD700', // Clear, thick golden border
              borderRadius: '12px',        // Smooth rounded corners
              backgroundColor: '#1a1a2e',  // Dark background so the text and border pop
              padding: '24px',             
              textAlign: 'center', 
              direction: 'ltr', 
              lineHeight: '1.5',
              boxShadow: '0px 10px 30px rgba(0,0,0,0.8)' // Deep shadow
            }}>
              
              <h2 style={{ margin: '0 0 15px 0', color: '#FFD700', fontSize: '1.4rem' }}>
                Level Rules
              </h2>

              {config.tutorialSegments?.map((seg, i) => (
                <p key={i} style={{ 
                  margin: '0 0 10px 0', 
                  fontSize: '1rem', // Smaller text to fit the new layout
                  color: seg.includes('⚠️') ? '#ff6b6b' : '#e0e0e0', 
                  fontWeight: seg.includes('⚠️') ? 'bold' : 'normal'
                }}>
                  {seg}
                </p>
              ))}
              
              <button 
                onClick={() => setShowTutorial(false)}
                style={{
                  width: '100%',
                  padding: '12px',
                  marginTop: '15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: '2px solid #ffffff', // Clear border around the button too
                  borderRadius: '8px',
                  fontSize: '1.1rem',
                  fontWeight: 'bold',
                  cursor: 'pointer',
                  fontFamily: 'inherit',
                  textTransform: 'uppercase'
                }}
              >
                I Understand!
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