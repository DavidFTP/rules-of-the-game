import { useRef, useCallback } from 'react'
import { hubGrid, hubDoors, hubPlayerStart, HUB_ROWS } from '../levels/hub/hubData.js'
import { useKeyboard } from './useKeyboard.js'

const MOVE_DIRS = {
  ArrowUp:    { dr: -1, dc:  0 },
  ArrowDown:  { dr:  1, dc:  0 },
  ArrowLeft:  { dr:  0, dc: -1 },
  ArrowRight: { dr:  0, dc:  1 },
}

/**
 * useHubPlayer(onEnterDoor)
 *
 * All hub movement logic lives here — not in any component.
 * Components read playerRef.current each animation frame to know where to draw.
 * Both keyboard and touch input call movePlayer() — same function, one source of truth.
 *
 * Returns:
 *   playerRef      — mutable ref { r, c, dir } — read every frame to draw the character
 *   movePlayer(key) — ArrowUp/Down/Left/Right moves, 'Enter' triggers door entry
 *   nearestDoor()  — returns the nearest door if within 2 tiles, else null
 */
export function useHubPlayer(onEnterDoor) {
  const playerRef = useRef({ ...hubPlayerStart, dir: 'down' })

  const nearestDoor = useCallback(() => {
    const p = playerRef.current
    let best = null, bestDist = Infinity
    hubDoors.forEach(d => {
      const dist = Math.abs(d.row - p.r) + Math.abs(d.col - p.c)
      if (dist < bestDist) { bestDist = dist; best = d }
    })
    return best && bestDist <= 2 ? best : null
  }, [])

  const movePlayer = useCallback((key) => {
    if (key === 'Enter' || key === 'e' || key === 'E') {
      const door = nearestDoor()
      if (door) onEnterDoor?.(door)
      return
    }
    const mv = MOVE_DIRS[key]
    if (!mv) return
    const dirMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
    const p  = playerRef.current
    const nr = p.r + mv.dr
    const nc = p.c + mv.dc
    if (nr < 0 || nc < 0 || nr >= HUB_ROWS || nc >= (hubGrid[nr]?.length ?? 0)) return
    if (hubGrid[nr][nc] === '#' || hubGrid[nr][nc] === ' ') return
    playerRef.current = { r: nr, c: nc, dir: dirMap[key] ?? p.dir }
  }, [nearestDoor, onEnterDoor])

  // Keyboard wiring belongs in a hook, never in a component
  useKeyboard(({ key, isP1, isAction }) => {
    if (isAction && (key === 'e' || key === 'E')) { movePlayer('Enter'); return }
    if (isP1) movePlayer(key)
  }, true)

  return { playerRef, movePlayer, nearestDoor }
}
