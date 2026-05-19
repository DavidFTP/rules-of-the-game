import { DIRS } from './constants.js'
import { isWall, isCrack, isTarget, findBoxAt, findSpecialAt } from './collision.js'

/**
 * moveEntity(state, key, playerKey)
 *
 * playerKey is either 'playerPos' (P1) or 'player2Pos' (P2).
 * Returns a NEW state object — never mutates the original.
 * Attaches _bump, _crackLose flags for the UI to react to.
 */
export function moveEntity(state, key, playerKey = 'playerPos') {
  const dir = DIRS[key]
  if (!dir) return state

  const { grid, boxes, targets, specials } = state
  const pos = state[playerKey]
  if (!pos) return state

  const nr = pos.r + dir.dr
  const nc = pos.c + dir.dc

  // Wall check
  if (isWall(grid, nr, nc)) {
    return { ...state, _bump: true }
  }

  // Check if another player is standing there (co-op)
  const otherKey = playerKey === 'playerPos' ? 'player2Pos' : 'playerPos'
  const otherPos = state[otherKey]
  if (otherPos && otherPos.r === nr && otherPos.c === nc) {
    return { ...state, _bump: true }
  }

  // Box push
  const boxIdx = findBoxAt(boxes, nr, nc)
  if (boxIdx !== -1) {
    const br2 = nr + dir.dr
    const bc2 = nc + dir.dc

    if (isWall(grid, br2, bc2)) return { ...state, _bump: true }
    if (findBoxAt(boxes, br2, bc2) !== -1) return { ...state, _bump: true }
    // Can't push box into other player
    if (otherPos && otherPos.r === br2 && otherPos.c === bc2) return { ...state, _bump: true }

    const pushedBox = boxes[boxIdx]

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

    const newBoxes = boxes.map((b, i) => {
      if (i !== boxIdx) return b
      return { ...b, r: br2, c: bc2, onTarget: isTarget(targets, br2, bc2) }
    })

    return {
      ...state,
      [playerKey]: { r: nr, c: nc },
      boxes: newBoxes,
      moves: state.moves + 1,
      _bump: false,
      _crackLose: false,
    }
  }

  // Switch interaction
  const swIdx = findSpecialAt(specials, nr, nc)
  if (swIdx !== -1 && specials[swIdx].type === 'switch') {
    const newSpecials = specials.map((s, i) =>
      i === swIdx ? { ...s, active: true } : s
    )
    return {
      ...state,
      [playerKey]: { r: nr, c: nc },
      specials: newSpecials,
      fogLifted: true,
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
      tokens: state.tokens + (specials[coinIdx].amount ?? 10),
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
    _crackLose: false,
  }
}