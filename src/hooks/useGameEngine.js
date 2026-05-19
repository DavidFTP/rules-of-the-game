import { useState, useCallback, useRef, useEffect } from 'react'
import { parseMap } from '../engine/levelParser.js'
import { moveEntity } from '../engine/movement.js'
import { checkWin } from '../engine/winCondition.js'
import { pushHistory, popHistory } from '../engine/historyStack.js'
import { useKeyboard } from './useKeyboard.js'
import LEVELS from '../levels/index.js'

/**
 * useGameEngine(levelNum, onWin)
 *
 * Central hook wiring together: parsing, movement, undo, win detection,
 * Simon-Says validation, and keyboard input.
 *
 * Returns: { state, restarts, won, handleRestart }
 */
export function useGameEngine(levelNum, onWin) {
  const levelData = LEVELS[levelNum]

  function buildInitialState() {
    if (!levelData) return null
    const mapLines = levelData.rounds
      ? levelData.rounds[0].map
      : levelData.map

    if (!mapLines) return null

    const parsed = parseMap(mapLines, {
      boxes:        levelData.boxes,
      targets:      levelData.targets,
      playerStart:  levelData.playerStart,
      player2Start: levelData.player2Start,
    })

    return {
      ...parsed,
      config:      levelData.config,
      fogLifted:   !(levelData.config?.fogOfWar),
      placedOrder: [],
      simonStep:   0,
    }
  }

  const [state,    setState]    = useState(buildInitialState)
  const [history,  setHistory]  = useState([])
  const [restarts, setRestarts] = useState(0)
  const [won,      setWon]      = useState(false)
  const wonRef = useRef(false)

  // Win detection runs after every state change
  useEffect(() => {
    if (!state || wonRef.current) return
    if (checkWin(state)) {
      wonRef.current = true
      setWon(true)
      onWin?.()
    }
  }, [state, onWin])

  const handleRestart = useCallback(() => {
    wonRef.current = false
    setWon(false)
    setHistory([])
    setRestarts(r => r + 1)
    setState(buildInitialState())
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [levelNum])

  const handleUndo = useCallback(() => {
    setHistory(h => {
      const { prev, history: next } = popHistory(h)
      if (prev) setState(prev)
      return next
    })
  }, [])

  const handleMove = useCallback((key, playerKey) => {
    if (wonRef.current) return

    setState(current => {
      if (!current) return current

      // ── Simon Says validation (Level 5) ──
      const config = current.config
      if (config?.topStripMode === 'simon') {
        const seq  = config.simonSequence ?? []
        const step = current.simonStep ?? 0
        if (step < seq.length && key !== seq[step]) {
          // Wrong key — reset simon progress, don't move
          return { ...current, simonStep: 0 }
        }
      }

      // Save to history before moving
      setHistory(h => pushHistory(h, current))

      const next = moveEntity(current, key, playerKey)

      // Advance Simon step if correct key was pressed
      if (config?.topStripMode === 'simon') {
        const seq  = config.simonSequence ?? []
        const step = current.simonStep ?? 0
        if (step < seq.length) {
          return { ...next, simonStep: step + 1 }
        }
      }

      // Track placed order for ordered-win levels (L1, L6)
      if (config?.enforceOrder) {
        const justPlaced = next.boxes.filter(
          (b, i) => b.onTarget && !current.boxes[i]?.onTarget
        )
        if (justPlaced.length > 0) {
          const newOrder = [
            ...(current.placedOrder ?? []),
            ...justPlaced.map(b => b.type),
          ]
          return { ...next, placedOrder: newOrder }
        }
      }

      return next
    })
  }, [])

  // Keyboard wiring
  useKeyboard(({ key, isP1, isP2, isAction }) => {
    if (isAction) {
      if (key === 'r' || key === 'R') { handleRestart(); return }
      if (key === 'z' || key === 'Z') { handleUndo();    return }
    }
    if (isP1) {
      handleMove(key, 'playerPos')
    }
    if (isP2 && state?.config?.coop) {
      const p2map = { w: 'ArrowUp', s: 'ArrowDown', a: 'ArrowLeft', d: 'ArrowRight' }
      handleMove(p2map[key.toLowerCase()] ?? key, 'player2Pos')
    }
  }, !!state && !won)

  return { state, restarts, won, handleRestart }
}