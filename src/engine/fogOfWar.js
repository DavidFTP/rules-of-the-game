/**
 * getVisibleCells(playerPos, radius, rows, cols)
 * Returns a Set of "r,c" strings that are within the fog radius.
 * Used by the canvas renderer to decide what to draw clearly vs dark.
 */
export function getVisibleCells(playerPos, radius, rows, cols) {
  if (!playerPos) return new Set()
  const visible = new Set()
  const { r: pr, c: pc } = playerPos
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const dist = Math.sqrt((r - pr) ** 2 + (c - pc) ** 2)
      if (dist <= radius) visible.add(`${r},${c}`)
    }
  }
  return visible
}