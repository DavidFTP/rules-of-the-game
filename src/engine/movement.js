import { DIRS } from './constants.js'
import { isWall, isCrack, isTarget, findBoxAt, findSpecialAt } from './collision.js'

export function moveEntity(state, key, playerKey = 'playerPos') {
  const dir = DIRS[key]
  if (!dir) return state

  const { grid, boxes, targets, specials } = state
  const pos = state[playerKey]
  if (!pos) return state

  const nr = pos.r + dir.dr
  const nc = pos.c + dir.dc

  if (isWall(grid, nr, nc)) {
    return { ...state, _bump: true }
  }

  // Check if another player is standing there (co-op)
  const otherKey = playerKey === 'playerPos' ? 'player2Pos' : 'playerPos'
  const otherPos = state[otherKey]
  if (otherPos && otherPos.r === nr && otherPos.c === nc) return { ...state, _bump: true }

  // Box push
  const boxIdx = findBoxAt(boxes, nr, nc)
  
  if (boxIdx !== -1) {
    const br2 = nr + dir.dr
    const bc2 = nc + dir.dc

    // --- 💪 POWERUP: SUPER PUSH (2 BOXES) ---
    let secondBoxIdx = findBoxAt(boxes, br2, bc2);
    if (secondBoxIdx !== -1) {
      // If they haven't bought Super Push, they can't move 2 boxes!
      if (!state.activePowerups?.includes('superPush')) return { ...state, _bump: true };

      const br3 = br2 + dir.dr;
      const bc3 = bc2 + dir.dc;

      // Check if space behind the second box is blocked
      if (isWall(grid, br3, bc3)) return { ...state, _bump: true };
      if (findBoxAt(boxes, br3, bc3) !== -1) return { ...state, _bump: true }; 
      if (otherPos && otherPos.r === br3 && otherPos.c === bc3) return { ...state, _bump: true };

      const newBoxes = boxes.map((b, i) => {
        if (i === boxIdx) return { ...b, r: br2, c: bc2, onTarget: isTarget(targets, br2, bc2) };
        if (i === secondBoxIdx) return { ...b, r: br3, c: bc3, onTarget: isTarget(targets, br3, bc3) };
        return b;
      });

      return {
        ...state,
        [playerKey]: { r: nr, c: nc },
        boxes: newBoxes,
        moves: state.moves + 1,
        _bump: false,
      }
    }

    if (isWall(grid, br2, bc2)) return { ...state, _bump: true }
    
    // Normal single box push (Heavy box logic included)
    const pushedBox = boxes[boxIdx]
    let pushCost = pushedBox.type === 'brown' ? 10 : 0;
    if ((state.tokens || 0) < pushCost) return { ...state, _bump: true }

    const newBoxes = boxes.map((b, i) => {
      if (i !== boxIdx) return b
      return { ...b, r: br2, c: bc2, onTarget: isTarget(targets, br2, bc2) }
    })

    return {
      ...state,
      [playerKey]: { r: nr, c: nc },
      boxes: newBoxes,
      tokens: state.tokens - pushCost, // Deduct tokens if heavy!
      moves: state.moves + 1,
      _bump: false,
    }
  }

  // Coin collection
  const coinIdx = findSpecialAt(specials, nr, nc)
  if (coinIdx !== -1 && specials[coinIdx].type === 'coin') {
    const newSpecials = specials.filter((_, i) => i !== coinIdx)
    return {
      ...state,
      [playerKey]: { r: nr, c: nc },
      specials: newSpecials,
      tokens: (state.tokens || 0) + (specials[coinIdx].amount ?? 10),
      moves: state.moves + 1,
      _bump: false,
    }
  }

  // Plain move
  return {
    ...state,
    [playerKey]: { r: nr, c: nc },
    moves: state.moves + 1,
    _bump: false,
  }
}
/**
 * 🚪 Reusable Gate Opener
 * Turns a gate into a floor tile. 
 * Pass a specific gateId to open one gate, or leave it blank to open all gates.
 */
export function openGate(state, gateId = null) {
  let gateFound = false;
  
  // Clone the grid so we don't mutate the original state
  const newGrid = state.grid.map(row => [...row]);
  
  // Filter out the gate we are opening
  const newSpecials = state.specials.filter(s => {
    if (s.type === 'gate' && (!gateId || s.id === gateId)) {
      newGrid[s.r][s.c] = 0; // 0 = T.FLOOR. The wall is destroyed!
      gateFound = true;
      return false; // Remove the gate from the specials array completely
    }
    return true; // Keep all other specials (coins, switches, etc.)
  });

  // If no gate was found or matched the ID, just return the state unchanged
  if (!gateFound) return state;

  // Return the shiny new state with the open door
  return {
    ...state,
    grid: newGrid,
    specials: newSpecials
  };
}