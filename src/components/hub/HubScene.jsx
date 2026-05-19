import React, { useEffect, useRef, useCallback } from 'react'
import { hubMap, hubDoors, hubPlayerStart } from '../../levels/hub/hubMap.js'
import { useKeyboard } from '../../hooks/useKeyboard.js'
import styles from './HubScene.module.css'

const CS = 52  // cell size

// Parse hub map into grid of characters
function parseHubMap() {
  return hubMap.map(line => line.split(''))
}

export default function HubScene({ onEnterLevel }) {
  const canvasRef  = useRef(null)
  const playerRef  = useRef({ ...hubPlayerStart, dir: 'down' })
  const rafRef     = useRef(null)
  const gridRef    = useRef(parseHubMap())

  // Replace D1-DA characters with a door marker we can style
  // (hub map uses 'D1' as two chars; we treat any char that's a digit or 'A'
  //  in a door-adjacent position as a door — but our map already uses a single
  //  char per cell. Doors are at the exact col positions from hubDoors.)
  const isDoor = useCallback((r, c) => {
    return hubDoors.some(d => d.row === r && d.col === c)
  }, [])

  const getDoor = useCallback((r, c) => {
    return hubDoors.find(d => d.row === r && d.col === c) ?? null
  }, [])

  const nearestDoor = useCallback(() => {
    const p = playerRef.current
    let best = null, bestDist = Infinity
    hubDoors.forEach(d => {
      const dist = Math.abs(d.row - p.r) + Math.abs(d.col - p.c)
      if (dist < bestDist) { bestDist = dist; best = d }
    })
    return best && bestDist <= 2 ? best : null
  }, [])

  // Draw a single frame
  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const grid = gridRef.current
    const rows = grid.length
    const cols = grid[0].length

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Background floor
    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const ch = grid[r][c]
        const x = c * CS, y = r * CS

        if (ch === '#') {
          // Wall
          ctx.fillStyle = '#2a1a0a'
          ctx.fillRect(x, y, CS, CS)
          ctx.strokeStyle = '#3a2510'
          ctx.lineWidth = 1
          ctx.strokeRect(x + 0.5, y + 0.5, CS - 1, CS - 1)
        } else if (isDoor(r, c)) {
          const door = getDoor(r, c)
          const pulse = (Math.sin(Date.now() / 500) + 1) / 2
          // Door tile
          ctx.fillStyle = '#15153a'
          ctx.fillRect(x, y, CS, CS)
          ctx.fillStyle = '#303080'
          ctx.fillRect(x + 6, y + 4, CS - 12, CS - 6)
          ctx.fillStyle = '#5050c0'
          ctx.fillRect(x + 9, y + 7, CS - 18, CS - 14)
          // Glow
          ctx.shadowColor = '#f5a623'
          ctx.shadowBlur = 4 + pulse * 14
          ctx.strokeStyle = `rgba(245,166,35,${0.45 + pulse * 0.55})`
          ctx.lineWidth = 2
          ctx.strokeRect(x + 2, y + 2, CS - 4, CS - 4)
          ctx.shadowBlur = 0
          // Number label
          if (door) {
            ctx.fillStyle = '#f5a623'
            ctx.font = `bold 15px monospace`
            ctx.textAlign = 'center'
            ctx.fillText(door.id.toString(), x + CS / 2, y + CS / 2 + 6)
          }
        } else {
          // Floor — checkerboard grass
          ctx.fillStyle = (r + c) % 2 === 0 ? '#1c3a1c' : '#183018'
          ctx.fillRect(x, y, CS, CS)
        }
      }
    }

    // Draw player
    const p = playerRef.current
    const px = p.c * CS, py = p.r * CS
    // Shadow
    ctx.fillStyle = 'rgba(0,0,0,0.3)'
    ctx.beginPath()
    ctx.ellipse(px + CS/2, py + CS - 5, 13, 5, 0, 0, Math.PI * 2)
    ctx.fill()
    // Body
    ctx.fillStyle = '#b02020'
    ctx.fillRect(px + 10, py + 20, 32, 24)
    // Head
    ctx.fillStyle = '#f5c58a'
    ctx.fillRect(px + 12, py + 7, 28, 19)
    // Hat brim
    ctx.fillStyle = '#b02020'
    ctx.fillRect(px + 7, py + 4, 38, 8)
    ctx.fillRect(px + 13, py - 3, 26, 9)
    // Eyes
    ctx.fillStyle = '#222'
    ctx.fillRect(px + 17, py + 12, 4, 4)
    ctx.fillRect(px + 31, py + 12, 4, 4)
    // Mustache
    ctx.fillStyle = '#4a2808'
    ctx.fillRect(px + 15, py + 20, 22, 4)

    // "Press E" prompt near nearest door
    const near = nearestDoor()
    if (near) {
      const dx = near.col * CS + CS / 2
      const dy = near.row * CS - 10
      ctx.fillStyle = 'rgba(0,0,0,0.7)'
      ctx.fillRect(dx - 60, dy - 15, 120, 20)
      ctx.fillStyle = '#f5a623'
      ctx.font = '10px monospace'
      ctx.textAlign = 'center'
      ctx.fillText('Press E to enter', dx, dy)
    }
  }, [isDoor, getDoor, nearestDoor])

  // Animation loop
  useEffect(() => {
    function loop() {
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  // Resize canvas to fill container
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const grid = gridRef.current
    canvas.width  = grid[0].length * CS
    canvas.height = grid.length * CS
  }, [])

  // Keyboard movement
  useKeyboard(({ key, isP1, isAction }) => {
    if (isAction && (key === 'e' || key === 'E')) {
      const door = nearestDoor()
      if (door) onEnterLevel?.(door)
      return
    }
    if (!isP1) return

    const MOVE = {
      ArrowUp:    { dr: -1, dc:  0 },
      ArrowDown:  { dr:  1, dc:  0 },
      ArrowLeft:  { dr:  0, dc: -1 },
      ArrowRight: { dr:  0, dc:  1 },
    }
    const mv = MOVE[key]
    if (!mv) return

    const grid = gridRef.current
    const p = playerRef.current
    const nr = p.r + mv.dr
    const nc = p.c + mv.dc

    if (nr < 0 || nc < 0 || nr >= grid.length || nc >= grid[0].length) return
    if (grid[nr][nc] === '#') return

    const dirMap = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' }
    playerRef.current = { r: nr, c: nc, dir: dirMap[key] }
  }, true)

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.hint}>Arrow Keys to move &nbsp;|&nbsp; E to enter a door</div>
    </div>
  )
}