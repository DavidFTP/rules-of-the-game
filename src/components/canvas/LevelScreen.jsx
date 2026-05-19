import React, { useEffect, useState } from 'react'
import GameBoard from '../canvas/GameBoard.jsx'
import TopStrip  from '../layout/TopStrip.jsx'
import BottomStrip from '../layout/BottomStrip.jsx'
import { WinModal, CrackLoseModal, ComingSoonModal } from '../ui/GameModals.jsx'
import { useGameEngine } from '../../hooks/useGameEngine.js'
import { useTokens }     from '../../hooks/useTokens.js'
import LEVELS from '../../levels/index.js'
import styles from './LevelScreen.module.css'

export default function LevelScreen({ levelNum, onHub }) {
  const levelData = LEVELS[levelNum]
  const [showWin,   setShowWin]   = useState(false)
  const [showCrack, setShowCrack] = useState(false)
  const { bag, buy, purchases } = useTokens()

  const { state, restarts, won, handleRestart } = useGameEngine(levelNum, () => {
    setTimeout(() => setShowWin(true), 500)
  })

  // Watch for crack lose condition
  useEffect(() => {
    if (state?._crackLose) setShowCrack(true)
  }, [state?._crackLose])

  if (!levelData) {
    return (
      <div className={styles.wrap}>
        <ComingSoonModal levelNum={levelNum} onHub={onHub} />
      </div>
    )
  }

  const config = levelData.config

  return (
    <div className={styles.wrap}>
      <TopStrip
        config={config}
        state={state}
        levelNum={levelNum}
        restarts={restarts}
      />

      <div className={styles.canvas}>
        <GameBoard state={state} />

        {showWin && (
          <WinModal
            levelNum={levelNum}
            tokens={state?.tokens ?? 0}
            onHub={() => { setShowWin(false); onHub() }}
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
      />
    </div>
  )
}