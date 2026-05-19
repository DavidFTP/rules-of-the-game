import { T } from './constants.js'

export function isWall(grid, r, c) {
  if (r < 0 || c < 0 || r >= grid.length || c >= (grid[0]?.length ?? 0)) return true
  return grid[r][c] === T.WALL
}

export function isCrack(grid, r, c) {
  if (r < 0 || c < 0 || r >= grid.length) return false
  return grid[r][c] === T.CRACK
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