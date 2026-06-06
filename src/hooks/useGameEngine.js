import { useState, useCallback, useRef, useEffect } from 'react'
import { parseMap } from '../engine/levelParser.js'
import { moveEntity } from '../engine/movement.js'
import { checkWin } from '../engine/winCondition.js'
import { pushHistory, popHistory } from '../engine/historyStack.js'
import { useKeyboard } from './useKeyboard.js'
import LEVELS from '../levels/index.js'

/**
 * buildStateForRound(levelData, roundIndex)
 *
 * Works for both single-map levels and multi-round levels.
 * For multi-round, reads levelData.rounds[roundIndex].
 * Overrides (boxes, targets, playerStart) can live on the round object
 * OR on the level root — round-level values take priority.
 */
function buildStateForRound(levelData, roundIndex = 0) {
  if (!levelData) return null

  const isMulti  = Array.isArray(levelData.rounds)
  const round    = isMulti ? levelData.rounds[roundIndex] : null
  const mapLines = round?.map ?? levelData.map

  if (!mapLines) return null

  // Round-level overrides beat level-root overrides
  const parsed = parseMap(mapLines, {
    boxes:        round?.boxes        ?? levelData.boxes,
    targets:      round?.targets      ?? levelData.targets,
    playerStart:  round?.playerStart  ?? levelData.playerStart,
    player2Start: round?.player2Start ?? levelData.player2Start,
  })

  return {
    ...parsed,
    config:       { ...(levelData.config ?? {}), ...(round?.config ?? {}) },
    fogLifted:    !(levelData.config?.fogOfWar),
    placedOrder:  [],
    simonStep:    0,
    roundIndex,
    totalRounds:  isMulti ? levelData.rounds.length : 1,
    isFinalRound: isMulti ? roundIndex === levelData.rounds.length - 1 : true,
    active_Powerups: [],
  }
}

/**
 * useGameEngine(levelNum, { onRoundWin, onLevelWin })
 *
 * onRoundWin(roundIndex) — called when a non-final round is solved
 * onLevelWin()           — called when the final (or only) round is solved
 *
 * Exposes:
 *   state         — current game state
 *   restarts      — restart counter for hint unlock
 *   roundIndex    — which round we're on (0-based)
 *   totalRounds   — how many rounds this level has
 *   advanceRound  — call this after showing the between-round screen
 *   handleRestart — restart the level from round 1
 */
export function useGameEngine(levelNum, { onRoundWin, onLevelWin, onEscapeRequest } = {}) {
  const levelData = LEVELS[levelNum]

  const [roundIndex, setRoundIndex] = useState(0)
  const [state,      setState]      = useState(() => buildStateForRound(levelData, 0))
  const [history,    setHistory]    = useState([])
  const [restarts,   setRestarts]   = useState(0)
  // Tokens carry across rounds
  const [carriedTokens, setCarriedTokens] = useState(0)

  const wonRef      = useRef(false)
  const roundWonRef = useRef(false)

  // Reset everything when levelNum changes
  useEffect(() => {
    wonRef.current      = false
    roundWonRef.current = false
    setRoundIndex(0)
    setCarriedTokens(0)
    setHistory([])
    setRestarts(0)
    setState(buildStateForRound(LEVELS[levelNum], 0))
  }, [levelNum])

 // Win detection after every state change
  useEffect(() => {
    if (!state || wonRef.current || roundWonRef.current) return
    if (!checkWin(state)) return

    roundWonRef.current = true
    
    // 🚨 THIS IS THE FIX: Set the bag exactly to what the state has. 
    // Do NOT use "prev => prev + earned", otherwise it doubles every round!
    const currentTokens = state.tokens ?? 0;
    setCarriedTokens(currentTokens);

    if (state.isFinalRound) {
      wonRef.current = true
      onLevelWin?.()
    } else {
      onRoundWin?.(state.roundIndex)
    }
  }, [state, onRoundWin, onLevelWin])
  /** Move to the next round. Call this from the UI after showing a between-round screen. */
  const advanceRound = useCallback(() => {
    const nextIdx = roundIndex + 1
    const ld = LEVELS[levelNum]
    if (!ld?.rounds || nextIdx >= ld.rounds.length) return

    roundWonRef.current = false
    setRoundIndex(nextIdx)
    setHistory([])
    setState(prev => {
      const fresh = buildStateForRound(ld, nextIdx)
      if (!fresh) return prev
      // Carry tokens forward
      return { ...fresh, tokens: carriedTokens }
    })
  }, [roundIndex, levelNum, carriedTokens])

  const handleRestart = useCallback(() => {
    wonRef.current      = false
    roundWonRef.current = false
    setHistory([])
    setRestarts(r => r + 1)
    setRoundIndex(0)
    setCarriedTokens(0)
    setState(() => buildStateForRound(LEVELS[levelNum], 0))
  }, [levelNum])

  const handleUndo = useCallback(() => {
    setHistory(h => {
      const { prev, history: next } = popHistory(h)
      if (prev) setState(prev)
      return next
    })
  }, [])

  const handleMove = useCallback((key, playerKey) => {
    if (wonRef.current || roundWonRef.current) return

    setState(current => {
      if (!current) return current

      // Simon Says: wrong key resets progress without moving
      const cfg = current.config
      if (cfg?.topStripMode === 'simon') {
        const seq  = cfg.simonSequence ?? []
        const step = current.simonStep ?? 0
        if (step < seq.length && key !== seq[step]) {
          return { ...current, simonStep: 0 }
        }
      }

      setHistory(h => pushHistory(h, current))
      const next = moveEntity(current, key, playerKey)

      // Advance Simon step
      if (cfg?.topStripMode === 'simon') {
        const seq  = cfg.simonSequence ?? []
        const step = current.simonStep ?? 0
        if (step < seq.length) return { ...next, simonStep: step + 1 }
      }

      // Track box placement order (L1 grey-last, L6 council order)
      if (cfg?.enforceOrder) {
        const justPlaced = next.boxes.filter(
          (b, i) => b.onTarget && !current.boxes[i]?.onTarget
        )
        if (justPlaced.length > 0) {
          return {
            ...next,
            placedOrder: [...(current.placedOrder ?? []), ...justPlaced.map(b => b.type)],
          }
        }
      }

      return next
    })
  }, [])

  // --- FIX 1: INSTANT BOMB POWERUP ---
  const activatePowerup = useCallback((powerupId, cost) => {
    setState(current => {
      // Check if they can afford it and don't already have it
      if ((current.tokens || 0) >= cost && !current.activePowerups?.includes(powerupId)) {
        
        let nextState = {
          ...current,
          tokens: current.tokens - cost,
          activePowerups: [...(current.activePowerups || []), powerupId]
        };

        // 💥 IF IT IS THE BOMB, DESTROY ALL WALLS INSTANTLY!
        if (powerupId === 'bomb') {
          // 1. Clone the grid ONCE before making changes
          const newGrid = nextState.grid.map(row => [...row]);
          
          // 2. Find all destructible walls and turn them into floors
          nextState.specials.forEach(special => {
            if (special.type === 'destructible') {
              newGrid[special.r][special.c] = 0; // Turn to floor
            }
          });

          // 3. Save the newly cleared grid back to the state
          nextState.grid = newGrid;
          
          // 4. Filter out ALL destructible walls from the specials array in one clean sweep
          nextState.specials = nextState.specials.filter(s => s.type !== 'destructible');
        }

        return nextState;
      }
      return current;
    });
  }, []);
  
  // Keyboard
  useKeyboard(({ key, isP1, isP2, isAction }) => {
    if (isAction) {
      if (key === 'Escape') {
        onEscapeRequest?.()
        return
      }
      if (key === 'r' || key === 'R') { handleRestart(); return }
      if (key === 'z' || key === 'Z') { handleUndo();    return }
    }
    if (isP1) handleMove(key, 'playerPos')
    if (isP2 && state?.config?.coop) {
      const map = { w: 'ArrowUp', s: 'ArrowDown', a: 'ArrowLeft', d: 'ArrowRight' }
      handleMove(map[key.toLowerCase()] ?? key, 'player2Pos')
    }
  }, !!state && !wonRef.current)

  return {
    state,
    restarts,
    roundIndex,
    totalRounds: state?.totalRounds ?? 1,
    isFinalRound: state?.isFinalRound ?? true,
    carriedTokens,
    advanceRound,
    handleRestart,
    handleMove,
    handleUndo,
    activatePowerup,
  }
}
