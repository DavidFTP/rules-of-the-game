import React, { useEffect, useRef, useCallback } from 'react'
import { hubMap, hubDoors, hubPlayerStart } from '../../levels/hub/hubMap.js'
import { useKeyboard } from '../../hooks/useKeyboard.js'
import styles from './HubScene.module.css'

const CS          = 72   // tile size in world pixels (large for clarity)
const VIEWPORT_W  = 13   // tiles visible horizontally
const VIEWPORT_H  = 9    // tiles visible vertically

function parseHubMap() {
  return hubMap.map(line => line.split(''))
}

export default function HubScene({ onEnterLevel }) {
  const canvasRef  = useRef(null)
  const playerRef  = useRef({ ...hubPlayerStart, dir: 'down', frame: 0 })
  const rafRef     = useRef(null)
  const gridRef    = useRef(parseHubMap())
  const lastStepRef = useRef(Date.now())

  const isDoor    = useCallback((r, c) => hubDoors.some(d => d.row === r && d.col === c), [])
  const getDoor   = useCallback((r, c) => hubDoors.find(d => d.row === r && d.col === c) ?? null, [])

  const nearestDoor = useCallback(() => {
    const p = playerRef.current
    let best = null, bestDist = Infinity
    hubDoors.forEach(d => {
      const dist = Math.abs(d.row - p.r) + Math.abs(d.col - p.c)
      if (dist < bestDist) { bestDist = dist; best = d }
    })
    return best && bestDist <= 2 ? best : null
  }, [])

  // Camera: clamp so viewport doesn't go out of bounds
  function getCameraOrigin(p) {
    const grid = gridRef.current
    const mapRows = grid.length
    const mapCols = grid[0].length
    let camC = p.c - Math.floor(VIEWPORT_W / 2)
    let camR = p.r - Math.floor(VIEWPORT_H / 2)
    camC = Math.max(0, Math.min(camC, mapCols - VIEWPORT_W))
    camR = Math.max(0, Math.min(camR, mapRows - VIEWPORT_H))
    return { camR, camC }
  }

  const draw = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx   = canvas.getContext('2d')
    const grid  = gridRef.current
    const p     = playerRef.current
    const { camR, camC } = getCameraOrigin(p)

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw visible tiles
    for (let vr = 0; vr < VIEWPORT_H; vr++) {
      for (let vc = 0; vc < VIEWPORT_W; vc++) {
        const gr = camR + vr
        const gc = camC + vc
        const x  = vc * CS
        const y  = vr * CS
        if (gr < 0 || gc < 0 || gr >= grid.length || gc >= grid[0].length) continue
        const ch = grid[gr][gc]

        if (ch === '#') {
          // Stone wall with mortar lines
          ctx.fillStyle = '#2a1a0a'
          ctx.fillRect(x, y, CS, CS)
          const bh = Math.floor(CS / 3)
          ctx.fillStyle = '#3d2810'
          for (let bi = 0; bi < 3; bi++) {
            const offset = bi % 2 === 0 ? 0 : Math.floor(CS / 2)
            ctx.fillRect(x + offset + 1, y + bi*bh + 1, Math.floor(CS/2)-3, bh-2)
            ctx.fillRect(x + offset + Math.floor(CS/2) + 1, y + bi*bh + 1, Math.floor(CS/2)-3, bh-2)
          }
        } else if (isDoor(gr, gc)) {
          const door = getDoor(gr, gc)
          const pulse = (Math.sin(Date.now() / 500) + 1) / 2
          // Door frame
          ctx.fillStyle = '#1a1a4a'
          ctx.fillRect(x, y, CS, CS)
          ctx.fillStyle = '#2a2a80'
          ctx.fillRect(x + 8, y + 5, CS - 16, CS - 8)
          // Door panels
          ctx.fillStyle = '#3a3aaa'
          ctx.fillRect(x + 12, y + 9,  (CS-24)/2 - 2, CS - 20)
          ctx.fillRect(x + 12 + (CS-24)/2 + 2, y + 9, (CS-24)/2 - 2, CS - 20)
          // Knob
          ctx.fillStyle = '#f5a623'
          ctx.beginPath()
          ctx.arc(x + CS/2, y + CS*0.6, 4, 0, Math.PI*2)
          ctx.fill()
          // Pulsing glow
          ctx.shadowColor = '#f5a623'
          ctx.shadowBlur  = 6 + pulse * 18
          ctx.strokeStyle = `rgba(245,166,35,${0.5 + pulse * 0.5})`
          ctx.lineWidth   = 2.5
          ctx.strokeRect(x + 3, y + 3, CS - 6, CS - 6)
          ctx.shadowBlur  = 0
          // Number label
          if (door) {
            ctx.fillStyle = '#f5a623'
            ctx.font = `bold ${Math.floor(CS * 0.32)}px 'Press Start 2P', monospace`
            ctx.textAlign = 'center'
            ctx.fillText(String(door.id), x + CS/2, y + CS*0.38)
          }
        } else {
          // Grass floor — subtle checkerboard
          ctx.fillStyle = (gr + gc) % 2 === 0 ? '#1e3a1e' : '#1a3218'
          ctx.fillRect(x, y, CS, CS)
          // Tiny grass tufts on even tiles
          if ((gr + gc) % 4 === 0) {
            ctx.fillStyle = 'rgba(80,160,80,0.18)'
            ctx.fillRect(x + CS*0.2, y + CS*0.6, 4, 8)
            ctx.fillRect(x + CS*0.6, y + CS*0.5, 4, 10)
          }
        }
      }
    }

    // Draw player (relative to camera)
    const px = (p.c - camC) * CS
    const py = (p.r - camR) * CS
    drawCharacter(ctx, px, py, 1, CS)

    // "Press E" prompt near door
    const near = nearestDoor()
    if (near) {
      const dx = (near.col - camC) * CS + CS/2
      const dy = (near.row - camR) * CS - 8
      if (dx > 0 && dy > 0 && dx < canvas.width && dy < canvas.height) {
        ctx.fillStyle = 'rgba(0,0,0,0.75)'
        ctx.fillRect(dx - 70, dy - 18, 140, 22)
        ctx.fillStyle = '#f5a623'
        ctx.font = `bold 11px 'Press Start 2P', monospace`
        ctx.textAlign = 'center'
        ctx.fillText('Press E to enter', dx, dy)
      }
    }
  }, [isDoor, getDoor, nearestDoor])

  useEffect(() => {
    function loop() {
      draw()
      rafRef.current = requestAnimationFrame(loop)
    }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [draw])

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = VIEWPORT_W * CS
    canvas.height = VIEWPORT_H * CS
  }, [])

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
    const p    = playerRef.current
    const nr   = p.r + mv.dr
    const nc   = p.c + mv.dc

    if (nr < 0 || nc < 0 || nr >= grid.length || nc >= grid[0].length) return
    if (grid[nr][nc] === '#') return

    playerRef.current = { ...p, r: nr, c: nc }
  }, true)

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} />
      <div className={styles.hint}>Arrow Keys to explore &nbsp;|&nbsp; E to enter a door</div>
    </div>
  )
}

function drawCharacter(ctx, x, y, playerNum, cs) {
  const isP2 = playerNum === 2
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.beginPath()
  ctx.ellipse(x + cs/2, y + cs - 6, cs*0.28, cs*0.1, 0, 0, Math.PI*2)
  ctx.fill()
  // Body
  ctx.fillStyle = isP2 ? '#1a7a1a' : '#b02020'
  ctx.fillRect(x + cs*0.2, y + cs*0.42, cs*0.6, cs*0.45)
  // Head
  ctx.fillStyle = '#f5c58a'
  ctx.fillRect(x + cs*0.24, y + cs*0.16, cs*0.52, cs*0.34)
  // Hat brim
  ctx.fillStyle = isP2 ? '#1a7a1a' : '#b02020'
  ctx.fillRect(x + cs*0.12, y + cs*0.10, cs*0.76, cs*0.14)
  // Hat top
  ctx.fillRect(x + cs*0.26, y - cs*0.04, cs*0.48, cs*0.16)
  // Eyes
  ctx.fillStyle = '#222'
  ctx.fillRect(x + cs*0.31, y + cs*0.24, cs*0.09, cs*0.09)
  ctx.fillRect(x + cs*0.60, y + cs*0.24, cs*0.09, cs*0.09)
  // Mustache
  ctx.fillStyle = '#4a2808'
  ctx.fillRect(x + cs*0.28, y + cs*0.38, cs*0.44, cs*0.08)
  // P2 white stripe
  if (isP2) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillRect(x + cs*0.26, y + cs*0.1, cs*0.48, cs*0.05)
  }
}
