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

  // 1. Let parseMap do its standard job WITHOUT the box override
  const parsed = parseMap(mapLines, {
    targets:      round?.targets      ?? levelData.targets,
    playerStart:  round?.playerStart  ?? levelData.playerStart,
    player2Start: round?.player2Start ?? levelData.player2Start,
  })

  // 2. Safely apply the boxes function (if it exists) to the parsed boxes
  const boxOverride = round?.boxes ?? levelData.boxes;
  let finalBoxes = parsed.boxes;
  if (typeof boxOverride === 'function') {
    finalBoxes = boxOverride(parsed.boxes);
  } else if (Array.isArray(boxOverride)) {
    finalBoxes = boxOverride;
  }

  return {
    ...parsed,
    boxes:        finalBoxes, // 👈 Injects the properly formatted array!
    config:       { ...(levelData.config ?? {}), ...(round?.config ?? {}) },
    fogLifted:    !(levelData.config?.fogOfWar),
    placedOrder:  [],
    simonStep:    0,
    _simonFailed: false,
    roundIndex,
    totalRounds:  isMulti ? levelData.rounds.length : 1,
    isFinalRound: isMulti ? roundIndex === levelData.rounds.length - 1 : true,
    activePowerups: [],
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
    if (!state || wonRef.current || roundWonRef.current || state._showSimonLose || state._showZoneLose) return;

    // 🚪 Did they step into a door in Map 1?
    if (state._triggeredDoor && state.roundIndex === 0) {
      roundWonRef.current = true;
      onRoundWin?.(state.roundIndex);
      return;
    }

    if (!checkWin(state)) return;

    // --- ⚖️ FATAL TRAP CHECK (Triggers if they finish the puzzle) ---
    if (state.config?.theme === 'level6' && state.roundIndex > 0) {
      if (state.chosenPath === 'left') {
        setState(s => ({ ...s, _showZoneLose: true, zoneLoseMessageKey: 'engine.trappedWestDoor' }));
        return;
      }
      // If it's the right path, handleMove already checked the order. They win!
    }

    if (state.config?.topStripMode === 'simon' && state._simonFailed) {
      setState(s => ({ ...s, _showSimonLose: true }));
      return;
    }

    roundWonRef.current = true;
    setCarriedTokens(state.tokens ?? 0);

    const isActuallyFinal = state.isFinalRound || (state.config?.theme === 'level6' && state.roundIndex > 0);

    if (isActuallyFinal) {
      wonRef.current = true;
      onLevelWin?.();
    } else {
      onRoundWin?.(state.roundIndex);
    }
  }, [state, onRoundWin, onLevelWin]);
  
  /** Move to the next round. Call this from the UI after showing a between-round screen. */
  const advanceRound = useCallback(() => {
    setState(prev => {
      let nextIdx = prev.roundIndex + 1;
      const path = prev._triggeredDoor || prev.chosenPath;
      
      // 💡 TELEPORT TO THE RIGHT MAP based on the door they touched!
      if (LEVELS[levelNum]?.config?.theme === 'level6' && prev.roundIndex === 0) {
        nextIdx = path === 'right' ? 2 : 1;
      }

      const ld = LEVELS[levelNum];
      if (!ld?.rounds || nextIdx >= ld.rounds.length) return prev;

      roundWonRef.current = false;
      setRoundIndex(nextIdx);
      setHistory([]);

      const fresh = buildStateForRound(ld, nextIdx);
      if (!fresh) return prev;
      
      return { ...fresh, tokens: carriedTokens, chosenPath: path };
    });
  }, [levelNum, carriedTokens]);
  
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

      setHistory(h => pushHistory(h, current))
      
      // Grab the custom push rules from the level's logic file
      const pushHook = LEVELS[levelNum]?.logic?.onBeforeBoxPush || LEVELS[levelNum]?.onBeforeBoxPush;
      
      // Pass the hook into moveEntity
      const next = moveEntity(current, key, playerKey, pushHook)

      // Clear the "2 Players Required" error after 1.5 seconds
      if (next._boxError && !current._boxError) {
        setTimeout(() => {
          setState(s => s ? { ...s, _boxError: null } : s);
        }, 1500);
      }

      // --- 💡 SIMON SAYS: FREE WILL LOGIC ---
      const cfg = current.config
      if (cfg?.topStripMode === 'simon') {
        const seq  = cfg.simonSequence ?? []
        const step = current.simonStep ?? 0

        if (!current._simonFailed) {
          if (step < seq.length && key === seq[step]) {
            next.simonStep = step + 1 
          } else {
            next._simonFailed = true  
            next.simonStep = step     
          }
        } else {
          next._simonFailed = true
          next.simonStep = current.simonStep
        }
      }

      // --- 🚪 LEVEL 6 DOOR TRIGGERS ---
      if (cfg?.theme === 'level6' && current.roundIndex === 0) {
        const nr = next[playerKey].r;
        const nc = next[playerKey].c;

        // Safe check using (next.specials || []) to prevent crashes
        const steppedOnDoor = (next.specials || []).some(s => s.type === 'door' && s.r === nr && s.c === nc);

        if (steppedOnDoor) {
          if (nc < 6) next._triggeredDoor = 'left';
          else next._triggeredDoor = 'right';
        }
      }

      // Track box placement order
      if (cfg?.enforceOrder) {
        const justPlaced = (next.boxes || []).filter(
          (b, i) => b.onTarget && !(current.boxes || [])[i]?.onTarget
        );
        if (justPlaced.length > 0) {
          next.placedOrder = [...(current.placedOrder ?? []), ...justPlaced.map(b => b.type)];
          
          // 🚨 INSTANT LOSE CHECK! Did they place a box out of order?
          const reqOrder = current.requiredOrder || cfg.requiredOrder;
          if (reqOrder) {
            for (let i = 0; i < next.placedOrder.length; i++) {
              if (next.placedOrder[i] !== reqOrder[i]) {
                console.log(`Box placed out of order! Expected ${reqOrder[i]}, but got ${next.placedOrder[i]}.`);
                next._showOrderLose = true;
                next.orderLoseMessageKey = 'engine.followRules';
                break;
              }
            }
          }

          if (cfg.theme === 'level6' && next.roundIndex > 0 && next.chosenPath === 'right') {
            const placed = next.placedOrder;
            if (placed.length === 1 && placed[0] !== 'blue') {
              next._showZoneLose = true;
              next.zoneLoseMessageKey = 'engine.truePathDisobey';
            }
          }
        }
      }
      return next;
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
