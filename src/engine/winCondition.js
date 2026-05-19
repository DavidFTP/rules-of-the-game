/**
 * checkWin(state)
 * Default win: every target has a box on it.
 * Levels can pass a custom winFn in their config to override.
 */
export function checkWin(state) {
  const { targets, boxes, config } = state
  if (!targets || targets.length === 0) return false

  // Custom win function supplied by a level
  if (config?.winFn) return config.winFn(state)

  return targets.every(t => boxes.some(b => b.r === t.r && b.c === t.c))
}

/**
 * checkOrderedWin(state, requiredOrder)
 * Used by levels that care about WHICH boxes were placed in which order
 * (Level 1 grey-last, Level 6 council order).
 * placedOrder is stored in state.placedOrder = ['green','blue','grey',...]
 */
export function checkOrderedWin(state, requiredOrder) {
  if (!checkWin(state)) return false
  if (!requiredOrder) return true
  const placed = state.placedOrder ?? []
  return requiredOrder.every((type, i) => placed[i] === type)
}