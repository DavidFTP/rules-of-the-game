import { useState, useRef, useEffect } from 'react'
import GameBoard   from '../canvas/GameBoard.jsx'
import { useAssets } from '../../contexts/AssetContext.jsx'
import TopStrip    from '../layout/TopStrip.jsx'
import BottomStrip from '../layout/BottomStrip.jsx'
import DPad        from '../ui/DPad.jsx'
import Modal, { ModalTitle, ModalBody, Btn } from '../ui/Modal.jsx'
import { WinModal, CrackLoseModal, ComingSoonModal, RoundWinModal } from '../ui/GameModals.jsx'
import { useGameEngine }  from '../../hooks/useGameEngine.js'
import { useTokens }      from '../../hooks/useTokens.js'
import { useSwipe }       from '../../hooks/useSwipe.js'
import { useTouchDevice } from '../../hooks/useTouchDevice.js'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import LEVELS from '../../levels/index.js'
import styles from './LevelScreen.module.css'

const DPAD_POSITIONS = ['none', 'center', 'left', 'right']

export default function LevelScreen({ levelNum, onHub }) {
  const { t } = useLanguage()
  const levelData     = LEVELS[levelNum]
  const canvasAreaRef = useRef(null)
  const [dpadPos, setDpadPos] = useState('none')
  const isTouch       = useTouchDevice()
  const { images } = useAssets()

  const [showLevelWin,   setShowLevelWin]   = useState(false)
  const [showRoundWin,   setShowRoundWin]   = useState(false)
  const [showTutorial,   setShowTutorial]   = useState(false)
  const [completedRound, setCompletedRound] = useState(null)
  const [showModeSelect, setShowModeSelect] = useState(false)
  const [coopMode, setCoopMode] = useState(true)

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

  const currentConfig = state?.config || levelData?.config

  useEffect(() => {
    if (currentConfig?.requiresPlayerSelection && roundIndex === 0) {
      setShowModeSelect(true)
    }
  }, [currentConfig, roundIndex, restarts])

  useEffect(() => {
    if (state && !coopMode) {
      if (state.config) state.config.coop = false
      state.player2Pos = null
    }
  }, [state, coopMode])

  const displayState = state ? {
    ...state,
    player2Pos: coopMode ? state.player2Pos : null
  } : null

  const showCrack = !!state?._crackLose

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

  function cycleDpadPos() {
    setDpadPos(prev => {
      const idx = DPAD_POSITIONS.indexOf(prev)
      return DPAD_POSITIONS[(idx + 1) % DPAD_POSITIONS.length]
    })
  }

  const config = levelData.config
  const isCoop = !!currentConfig?.coop && coopMode

  return (
    <div className={styles.wrap}>
      <TopStrip
        config={config}
        state={state}
        levelNum={levelNum}
        restarts={restarts}
        roundIndex={roundIndex}
        totalRounds={totalRounds}
        onTutorialClick={() => setShowTutorial(true)}
      />

      <div className={styles.canvasArea} ref={canvasAreaRef} style={{ position: 'relative' }}>
        <GameBoard state={displayState} images={images} />

        {showModeSelect && (
          <Modal title={t('levelScreen.chooseMode')} onClose={() => {}}>
            <div style={{ textAlign: 'center', padding: '10px' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '20px' }}>
                {t('levelScreen.howToPlay')}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                <button 
                  onClick={() => { setCoopMode(false); setShowModeSelect(false) }}
                  style={{ padding: '12px 20px', backgroundColor: '#4a90e2', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {t('levelScreen.solo')}
                </button>
                <button 
                  onClick={() => { setCoopMode(true); setShowModeSelect(false) }}
                  style={{ padding: '12px 20px', backgroundColor: '#28a745', color: 'white', borderRadius: '6px', border: 'none', cursor: 'pointer', fontWeight: 'bold' }}
                >
                  {t('levelScreen.coop')}
                </button>
              </div>
            </div>
          </Modal>
        )}

        {state?._showOrderLose && (
          <Modal title={t('levelScreen.incorrectOrderTitle')} onClose={() => {}}>
            <div style={{ textAlign: 'center', padding: '10px', lineHeight: '1.8' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#ffbbbb' }}>
                {state.orderLoseMessageKey ? t(state.orderLoseMessageKey) : state.orderLoseMessage}
              </p>
              <button 
                onClick={handleRestart}
                style={{
                  width: '100%', padding: '12px', marginTop: '20px',
                  backgroundColor: '#e94560', color: 'white', border: 'none',
                  borderRadius: '6px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {t('levelScreen.restartRound')}
              </button>
            </div>
          </Modal>
        )}

        {state?._showSimonLose && (
          <Modal title={t('levelScreen.disobeyedTitle')} onClose={() => {}}>
            <div style={{ textAlign: 'center', padding: '10px', lineHeight: '1.8' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '15px' }}>
                {t('levelScreen.disobeyedBody1')}
              </p>
              <p style={{ fontSize: '1.1rem', color: '#ffbbbb' }}>
                {t('levelScreen.disobeyedBody2')}
              </p>
              <button 
                onClick={handleRestart}
                style={{
                  width: '100%', padding: '12px', marginTop: '20px',
                  backgroundColor: '#e94560', color: 'white', border: 'none',
                  borderRadius: '6px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {t('levelScreen.restartAndObey')}
              </button>
            </div>
          </Modal>
        )}

        {state?._showZoneLose && (
          <Modal title={t('levelScreen.incorrectOrderTitle')} onClose={() => {}}>
            <div style={{ textAlign: 'center', padding: '10px', lineHeight: '1.8' }}>
              <p style={{ fontSize: '1.2rem', marginBottom: '15px', color: '#ffbbbb' }}>
                {state.zoneLoseMessageKey ? t(state.zoneLoseMessageKey) : state.zoneLoseMessage}
              </p>
              <button 
                onClick={handleRestart}
                style={{
                  width: '100%', padding: '12px', marginTop: '20px',
                  backgroundColor: '#e94560', color: 'white', border: 'none',
                  borderRadius: '6px', fontSize: '1.2rem', fontWeight: 'bold', cursor: 'pointer'
                }}
              >
                {t('levelScreen.restartRound')}
              </button>
            </div>
          </Modal>
        )}

          <div className={styles.escButton}>
            <button
              className={styles.iconBtn}
              onClick={onHub}
              aria-label={t('levelScreen.returnToHub')}
            >
              ⌂
            </button>
          </div>
          <div className={styles.topRightButtons}>
            {isTouch && !isCoop && (
              <button
                className={styles.dpadToggleBtn}
                onClick={cycleDpadPos}
                aria-label={t('levelScreen.controls')}
              >
                <span className={styles.dpadToggleLabel}>{t('levelScreen.controls')}</span>
              </button>
            )}
            <button
              className={styles.iconBtn}
              onClick={() => handleUndo?.()}
              aria-label={t('levelScreen.undo')}
            >
              ↩
            </button>
            <button
              className={styles.iconBtn}
              onClick={handleRestart}
              aria-label={t('levelScreen.restart')}
            >
              ↺
            </button>
          </div>
        {isTouch && (
          <>
            {isCoop ? (
              <div className={styles.touchControlsCoop}>
                <div className={styles.padSide}>
                  <DPad
                    compact
                    label={t('levelScreen.p2')}
                    accentColor="#1a7a1a"
                    onMove={(k) => handleMove?.(k, 'player2Pos')}
                  />
                </div>
                <div className={styles.padSide}>
                  <DPad
                    compact
                    label={t('levelScreen.p1')}
                    onMove={(k) => handleMove?.(k, 'playerPos')}
                  />
                </div>
              </div>
            ) : (
              dpadPos !== 'none' && (
                <div className={`${styles.touchControls} ${styles['touchControls' + (dpadPos.charAt(0).toUpperCase() + dpadPos.slice(1))]}`}>
                  <DPad
                    compact
                    label={t('levelScreen.p1')}
                    onMove={(k) => handleMove?.(k, 'playerPos')}
                  />
                </div>
              )
            )}
          </>
        )}

        {showTutorial && (
          <Modal onClose={() => setShowTutorial(false)}>
            <ModalTitle>{t('levelScreen.levelRules')}</ModalTitle>
            <ModalBody>
              {config.tutorialSegments?.map((key, i) => {
                if (key === 'CLUE') return null
                const text = t(key)
                const isWarning = text.includes('⚠')
                return (
                  <span key={i} style={{ display: 'block', marginBottom: 8, color: isWarning ? '#ff6b6b' : 'inherit', fontWeight: isWarning ? 'bold' : 'normal' }}>
                    {text}
                  </span>
                )
              })}
            </ModalBody>
            <Btn variant="green" onClick={() => setShowTutorial(false)}>{t('levelScreen.iUnderstand')}</Btn>
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

      {config?.powerups && state?.isFinalRound && (
        <div style={{ 
          display: 'flex', gap: '10px', justifyContent: 'center', 
          padding: '10px', background: 'rgba(0,0,0,0.8)', borderTop: '2px solid #444' 
        }}>
          {config.powerups.map(pwr => {
            const isActive = state.activePowerups?.includes(pwr.id)
            const canAfford = (state.tokens || 0) >= pwr.cost
            return (
              <button 
                key={pwr.id}
                onClick={() => activatePowerup(pwr.id, pwr.cost)}
                disabled={isActive || !canAfford}
                style={{
                  padding: '8px 12px', borderRadius: '6px',
                  border: isActive ? '2px solid #4CAF50' : (canAfford ? '2px solid #FFD700' : '2px solid #555'),
                  backgroundColor: isActive ? '#1b4a1b' : '#222',
                  color: isActive ? '#4CAF50' : (canAfford ? '#fff' : '#777'),
                  cursor: (isActive || !canAfford) ? 'not-allowed' : 'pointer',
                  fontWeight: 'bold'
                }}
              >
                {t(pwr.nameKey ?? pwr.name)} <br/>
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
        levelNum={levelNum}
        roundIndex={roundIndex}
        totalRounds={totalRounds}
        carriedTokens={carriedTokens}
        moves={state?.moves ?? 0}
      />
    </div>
  )
}
