import { T } from './constants.js'

export function isWall(grid, r, c) {
  if (r < 0 || c < 0 || r >= grid.length) return true
  const row = grid[r]
  if (!row || c >= row.length) return true
  return row[c] === T.WALL || row[c] === T.VOID
}

export function isCrack(grid, r, c) {
  if (r < 0 || c < 0 || r >= grid.length) return false
  const row = grid[r]
  if (!row || c >= row.length) return false
  return row[c] === T.CRACK
}

export function isTarget(targets, r, c) {
  return targets.some(t => t.r === r && t.c === c)
}

export function findBoxAt(boxes, r, c) {
  return boxes.findIndex(b => b.r === r && b.c === c)
}

export function findSpecialAt(specials, r, c) {
  return specials.findIndex(s => s.r === r && s.c === c)
}