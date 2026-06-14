import { DIRS } from './constants.js'
import { isWall, isCrack, isTarget, findBoxAt, findSpecialAt } from './collision.js'

/**
 * moveEntity(state, key, playerKey)
 *
 * playerKey is either 'playerPos' (P1) or 'player2Pos' (P2).
 * Returns a NEW state object — never mutates the original.
 * Attaches _bump, _crackLose flags for the UI to react to.
 */
// Add onBeforeBoxPush as the 4th parameter
export function moveEntity(state, key, playerKey = 'playerPos', onBeforeBoxPush = null) {
  const dir = DIRS[key]
  if (!dir) return state

  const { grid, boxes, targets, specials } = state
  const pos = state[playerKey]
  if (!pos) return state

  const nr = pos.r + dir.dr
  const nc = pos.c + dir.dc

  // Wall check
  if (isWall(grid, nr, nc)) {
    return { ...state, _bump: true, _boxError: null } // Clear errors on normal bumps
  }

  // Check if another player is standing there (co-op)
  const otherKey = playerKey === 'playerPos' ? 'player2Pos' : 'playerPos'
  const otherPos = state[otherKey]
  // if (otherPos && otherPos.r === nr && otherPos.c === nc) {
  //   return { ...state, _bump: true, _boxError: null }
  // }

  // ==========================================
  // BOX PUSH LOGIC
  // ==========================================
  const boxIdx = findBoxAt(boxes, nr, nc)
  if (boxIdx !== -1) {
    const br2 = nr + dir.dr
    const bc2 = nc + dir.dc
    const pushedBox = boxes[boxIdx]

    // 🛑 RUN CUSTOM LEVEL RULES (Heavy Box Check)
    if (onBeforeBoxPush) {
      const result = onBeforeBoxPush(state, pushedBox, playerKey === 'playerPos' ? 1 : 2, dir.dc, dir.dr);
      if (!result.allowed) {
        return { 
          ...state, 
          _bump: true, 
          _boxError: { text: result.errorText, textKey: result.errorTextKey, r: pushedBox.r, c: pushedBox.c } 
        };
      }
    }

    if (isWall(grid, br2, bc2)) return { ...state, _bump: true, _boxError: null }

    // --- 💪 SUPER PUSH LOGIC ---
    let secondBoxIdx = findBoxAt(boxes, br2, bc2);
    let br3, bc3;

    if (secondBoxIdx !== -1) {
      // We hit a second box. Do we have the Super Push powerup?
      if (state.activePowerups?.includes('superPush')) {
        br3 = br2 + dir.dr;
        bc3 = bc2 + dir.dc;
        
        // Check if the space behind the SECOND box is blocked
        if (isWall(grid, br3, bc3)) return { ...state, _bump: true, _boxError: null };
        if (findBoxAt(boxes, br3, bc3) !== -1) return { ...state, _bump: true, _boxError: null }; // Can't push 3 boxes!
        if (otherPos && otherPos.r === br3 && otherPos.c === bc3) return { ...state, _bump: true, _boxError: null };
      } else {
        // No super push active, so block the push
        return { ...state, _bump: true, _boxError: null };
      }
    }
    
    // Can't push a box into the other player
    if (otherPos && otherPos.r === br2 && otherPos.c === bc2) return { ...state, _bump: true, _boxError: null }


    // Crack tile logic — only triggers for heavy/gold boxes
    if (isCrack(grid, br2, bc2) && pushedBox.type === 'gold') {
      const newBoxes = boxes.map((b, i) =>
        i === boxIdx ? { ...b, r: br2, c: bc2 } : b
      )
      return {
        ...state,
        [playerKey]: { r: nr, c: nc },
        boxes: newBoxes,
        moves: state.moves + 1,
        _bump: false,
        _crackLose: true,
      }
    }

    // --- CHRONOLOGICAL TRACKING ---
    let newPlacedOrder = state.placedOrder ? [...state.placedOrder] : [];
    
    // Track Box 1
    const wasOnTarget = isTarget(targets, pushedBox.r, pushedBox.c);
    const isNowOnTarget = isTarget(targets, br2, bc2);
    if (!wasOnTarget && isNowOnTarget) newPlacedOrder.push(pushedBox.type);
    else if (wasOnTarget && !isNowOnTarget) {
      const idx = newPlacedOrder.lastIndexOf(pushedBox.type);
      if (idx !== -1) newPlacedOrder.splice(idx, 1);
    }
    let isNowOnTarget2 = false;

    // Track Box 2 (If Super Pushing)
    if (secondBoxIdx !== -1) {
      const box2 = boxes[secondBoxIdx];
      const wasOnTarget2 = isTarget(targets, box2.r, box2.c);
      const isNowOnTarget2 = isTarget(targets, br3, bc3);
      if (!wasOnTarget2 && isNowOnTarget2) newPlacedOrder.push(box2.type);
      else if (wasOnTarget2 && !isNowOnTarget2) {
        const idx2 = newPlacedOrder.lastIndexOf(box2.type);
        if (idx2 !== -1) newPlacedOrder.splice(idx2, 1);
      }
    }

    // Apply movement to both boxes
    const newBoxes = boxes.map((b, i) => {
      if (i === boxIdx) return { ...b, r: br2, c: bc2, onTarget: isNowOnTarget };
      if (i === secondBoxIdx) return { ...b, r: br3, c: bc3, onTarget: isNowOnTarget2 };
      return b;
    });

    const dirMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
    const newDir = dirMap[key] ?? pos.dir ?? 'down'
    return {
      ...state,
      [playerKey]: { r: nr, c: nc, dir: newDir },
      boxes: newBoxes,
      placedOrder: newPlacedOrder,
      moves: state.moves + 1,
      _bump: false,
      _crackLose: false,
    }
  }

  // Switch interaction
  const swIdx = findSpecialAt(specials, nr, nc)
  
  // 🕵️‍♂️ DEBUG: Tell us what you see!
  if (swIdx !== -1) {
    console.log("🔍 Stepped on a special item! Type:", specials[swIdx].type);
  }

  if (swIdx !== -1 && specials[swIdx].type === 'switch') {
    console.log("💡 SWITCH PRESSED! Turning on the lights!");
    
    const newSpecials = specials.map((s, i) =>
      i === swIdx ? { ...s, active: true } : s
    )
    const dirMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
    const newDir = dirMap[key] ?? pos.dir ?? 'down'
    let nextState = {
      ...state,
      [playerKey]: { r: nr, c: nc, dir: newDir },
      specials: newSpecials,
      fogLifted: true, 
      moves: state.moves + 1,
      _bump: false,
    }

    return openGate(nextState); // Open the gate(s) when the switch is pressed
  }

  // Coin collection
  const coinIdx = findSpecialAt(specials, nr, nc)
  if (coinIdx !== -1 && specials[coinIdx].type === 'coin') {
    const newSpecials = specials.filter((_, i) => i !== coinIdx)
    const dirMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
    const newDir = dirMap[key] ?? pos.dir ?? 'down'
    return {
      ...state,
      [playerKey]: { r: nr, c: nc, dir: newDir },
      specials: newSpecials,
      tokens: state.tokens + (specials[coinIdx].amount ?? 10),
      moves: state.moves + 1,
      _bump: false,
    }
  }

  // Plain move
  const dirMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
  const newDir = dirMap[key] ?? pos.dir ?? 'down'
  return {
    ...state,
    [playerKey]: { r: nr, c: nc, dir: newDir },
    moves: state.moves + 1,
    _bump: false,
    _crackLose: false,
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