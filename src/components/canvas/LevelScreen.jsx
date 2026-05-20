import React, { useEffect, useState } from 'react'
import GameBoard     from '../canvas/GameBoard.jsx'
import TopStrip      from '../layout/TopStrip.jsx'
import BottomStrip   from '../layout/BottomStrip.jsx'
import TouchControls from '../ui/TouchControls.jsx'
import { WinModal, CrackLoseModal, ComingSoonModal, RoundWinModal } from '../ui/GameModals.jsx'
import { useGameEngine } from '../../hooks/useGameEngine.js'
import { useTokens }     from '../../hooks/useTokens.js'
import LEVELS from '../../levels/index.js'
import styles from './LevelScreen.module.css'

export default function LevelScreen({ levelNum, onHub }) {
  const levelData = LEVELS[levelNum]

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
  } = useGameEngine(levelNum, {
    onRoundWin: (idx) => {
      setCompletedRound(idx)
      setTimeout(() => setShowRoundWin(true), 500)
    },
    onLevelWin: () => {
      setTimeout(() => setShowLevelWin(true), 500)
    },
  })

  useEffect(() => {
    if (state?._crackLose) setShowCrack(true)
  }, [state?._crackLose])

  if (!levelData) {
    return (
      <div className={styles.wrap}>
        <div className={styles.canvas} id="canvas-touch-area">
          <ComingSoonModal levelNum={levelNum} onHub={onHub} />
        </div>
      </div>
    )
  }

  const config = levelData.config
  const isCoop = !!config?.coop

  // Touch move dispatcher — routes to correct player
  function handleTouchMove(key) {
    // Simulate a keydown event the engine hook will pick up
    const event = new KeyboardEvent('keydown', { key, bubbles: true })
    window.dispatchEvent(event)
  }

  function handleNextRound() {
    setShowRoundWin(false)
    setCompletedRound(null)
    advanceRound()
  }

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

      <div className={styles.canvas} id="canvas-touch-area">
        <GameBoard state={state} />

        {showRoundWin && !showLevelWin && (
          <RoundWinModal
            roundNum={completedRound + 1}
            totalRounds={totalRounds}
            tokens={carriedTokens}
            onNext={handleNextRound}
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

      {/* Mobile touch controls — hidden on desktop via CSS media query */}
      <TouchControls
        onMove={handleTouchMove}
        onUndo={() => handleTouchMove('z')}
        onRestart={() => handleTouchMove('r')}
        onHub={onHub}
        showP2={isCoop}
        onMoveP2={(key) => {
          const p2map = { ArrowUp: 'w', ArrowDown: 's', ArrowLeft: 'a', ArrowRight: 'd' }
          const event = new KeyboardEvent('keydown', { key: p2map[key] ?? key, bubbles: true })
          window.dispatchEvent(event)
        }}
      />
    </div>
  )
}