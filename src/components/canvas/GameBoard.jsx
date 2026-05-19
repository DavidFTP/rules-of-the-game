import React, { useEffect, useRef } from 'react'
import { T } from '../../engine/constants.js'
import { getVisibleCells } from '../../engine/fogOfWar.js'
import styles from './GameBoard.module.css'

const CS = 52  // cell size in pixels

export default function GameBoard({ state }) {
  const canvasRef    = useRef(null)
  const containerRef = useRef(null)

  useEffect(() => {
    if (!state || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx    = canvas.getContext('2d')
    drawFrame(ctx, state)
  }, [state])

  // Scale canvas to fit container whenever state changes (grid size may vary)
  useEffect(() => {
    if (!state || !canvasRef.current || !containerRef.current) return
    const canvas    = canvasRef.current
    const container = containerRef.current
    const cw = container.clientWidth
    const ch = container.clientHeight
    const scale = Math.min(cw / canvas.width, ch / canvas.height, 1)
    canvas.style.transform       = `scale(${scale})`
    canvas.style.transformOrigin = 'top left'
    canvas.style.position        = 'absolute'
    canvas.style.top  = `${(ch - canvas.height * scale) / 2}px`
    canvas.style.left = `${(cw - canvas.width  * scale) / 2}px`
  }, [state])

  if (!state) return null

  const rows = state.grid.length
  const cols = state.grid[0]?.length ?? 0

  return (
    <div ref={containerRef} className={styles.wrap}>
      <canvas
        ref={canvasRef}
        width={cols * CS}
        height={rows * CS}
        className={styles.canvas}
      />
    </div>
  )
}

// ── Drawing ──────────────────────────────────────────────────────────────────

function drawFrame(ctx, state) {
  const { grid, boxes, targets, specials, playerPos, player2Pos, config } = state
  const rows = grid.length
  const cols  = grid[0]?.length ?? 0

  ctx.clearRect(0, 0, cols * CS, rows * CS)

  const fogOn  = config?.fogOfWar && !state.fogLifted
  const visible = fogOn
    ? getVisibleCells(playerPos, config.fogRadius ?? 2.5, rows, cols)
    : null

  // Tiles
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      const inFog = visible && !visible.has(`${r},${c}`)
      drawCell(ctx, grid[r][c], r, c, inFog, specials)
    }
  }

  // Targets
  targets.forEach(t => {
    const inFog = visible && !visible.has(`${t.r},${t.c}`)
    if (!inFog) drawTarget(ctx, t.r, t.c)
  })

  // Boxes
  boxes.forEach(b => {
    const inFog = visible && !visible.has(`${b.r},${b.c}`)
    if (!inFog) {
      const onTarget = targets.some(t => t.r === b.r && t.c === b.c)
      drawBox(ctx, b, onTarget)
    }
  })

  // Players
  if (playerPos) {
    const inFog = visible && !visible.has(`${playerPos.r},${playerPos.c}`)
    if (!inFog) drawPlayer(ctx, playerPos, 1)
  }
  if (player2Pos) {
    const inFog = visible && !visible.has(`${player2Pos.r},${player2Pos.c}`)
    if (!inFog) drawPlayer(ctx, player2Pos, 2)
  }

  // Fog overlay on top of everything
  if (fogOn) drawFogOverlay(ctx, playerPos, rows, cols, config.fogRadius ?? 2.5)
}

function drawCell(ctx, type, r, c, inFog, specials) {
  const x = c * CS, y = r * CS
  if (inFog) {
    ctx.fillStyle = '#000'
    ctx.fillRect(x, y, CS, CS)
    return
  }
  if (type === T.WALL) {
    drawWall(ctx, x, y)
  } else if (type === T.CRACK) {
    drawCrack(ctx, x, y)
  } else if (type === T.SWITCH) {
    const sw = specials?.find(s => s.type === 'switch' && s.r === r && s.c === c)
    drawSwitch(ctx, x, y, sw?.active)
  } else {
    ctx.fillStyle = (r + c) % 2 === 0 ? '#1c2a3a' : '#18223a'
    ctx.fillRect(x, y, CS, CS)
  }
}

function drawWall(ctx, x, y) {
  ctx.fillStyle = '#3a2510'
  ctx.fillRect(x, y, CS, CS)
  const bh = Math.floor(CS / 3)
  ctx.fillStyle = '#4e3318'
  for (let bi = 0; bi < 3; bi++) {
    const offset = bi % 2 === 0 ? 0 : Math.floor(CS / 2)
    ctx.fillRect(x + offset,                     y + bi * bh + 1, Math.floor(CS / 2) - 2, bh - 2)
    ctx.fillRect(x + offset + Math.floor(CS / 2), y + bi * bh + 1, Math.floor(CS / 2) - 2, bh - 2)
  }
}

function drawCrack(ctx, x, y) {
  ctx.fillStyle = '#200a0a'
  ctx.fillRect(x, y, CS, CS)
  ctx.strokeStyle = '#7a2020'
  ctx.lineWidth = 1.5
  const cx = x + CS / 2, cy = y + CS / 2
  ctx.beginPath()
  ctx.moveTo(x + 6,    y + 6);    ctx.lineTo(cx, cy)
  ctx.moveTo(x+CS - 6, y + 6);   ctx.lineTo(cx, cy)
  ctx.moveTo(cx,       y+CS - 6); ctx.lineTo(cx, cy)
  ctx.stroke()
  ctx.fillStyle = 'rgba(200,40,40,0.12)'
  ctx.fillRect(x, y, CS, CS)
}

function drawSwitch(ctx, x, y, active) {
  ctx.fillStyle = '#182030'
  ctx.fillRect(x, y, CS, CS)
  ctx.fillStyle = active ? '#4caf50' : '#c07000'
  ctx.fillRect(x + 10, y + 10, CS - 20, CS - 20)
  ctx.fillStyle = '#fff'
  ctx.font = `bold ${Math.floor(CS / 4)}px monospace`
  ctx.textAlign = 'center'
  ctx.fillText(active ? 'ON' : 'SW', x + CS / 2, y + CS / 2 + 5)
}

function drawTarget(ctx, r, c) {
  const x = c * CS, y = r * CS
  ctx.fillStyle = 'rgba(76,175,80,0.18)'
  ctx.fillRect(x + 4, y + 4, CS - 8, CS - 8)
  ctx.strokeStyle = '#4caf50'
  ctx.lineWidth = 2
  const mx = x + CS/2, my = y + CS/2, hs = CS/2 - 9
  ctx.beginPath()
  ctx.moveTo(mx, my - hs); ctx.lineTo(mx + hs, my)
  ctx.lineTo(mx, my + hs); ctx.lineTo(mx - hs, my)
  ctx.closePath(); ctx.stroke()
}

const BOX_COLORS = {
  green:  { bg: '#2d8a4e', border: '#1a5a30', mark: '#50c080' },
  blue:   { bg: '#2060a0', border: '#103070', mark: '#4090d0' },
  red:    { bg: '#a03030', border: '#701010', mark: '#d06060' },
  grey:   { bg: '#506070', border: '#304050', mark: '#80a0b0' },
  brown:  { bg: '#7a5030', border: '#503010', mark: '#a07050' },
  gold:   { bg: '#b08000', border: '#806000', mark: '#e0c000' },
  silver: { bg: '#708090', border: '#506070', mark: '#90b0c0' },
}

function drawBox(ctx, box, onTarget) {
  const x = box.c * CS, y = box.r * CS
  const col = BOX_COLORS[box.type] ?? BOX_COLORS.green

  ctx.fillStyle = onTarget ? '#30a050' : col.bg
  roundRect(ctx, x + 3, y + 3, CS - 6, CS - 6, 7)
  ctx.fill()

  ctx.strokeStyle = onTarget ? '#18703a' : col.border
  ctx.lineWidth = 2
  ctx.stroke()

  ctx.strokeStyle = col.mark
  ctx.lineWidth = 2.5
  ctx.beginPath()
  ctx.moveTo(x + 13, y + 13);     ctx.lineTo(x + CS - 13, y + CS - 13)
  ctx.moveTo(x + CS - 13, y + 13); ctx.lineTo(x + 13,     y + CS - 13)
  ctx.stroke()

  if (box.value !== undefined) {
    ctx.fillStyle = '#fff'
    ctx.font = 'bold 9px monospace'
    ctx.textAlign = 'center'
    ctx.fillText(String(box.value), x + CS / 2, y + CS - 7)
  }
}

function drawPlayer(ctx, pos, playerNum) {
  const x = pos.c * CS, y = pos.r * CS
  const isP2 = playerNum === 2

  ctx.fillStyle = 'rgba(0,0,0,0.3)'
  ctx.beginPath()
  ctx.ellipse(x + CS/2, y + CS - 5, 14, 5, 0, 0, Math.PI * 2)
  ctx.fill()

  ctx.fillStyle = isP2 ? '#1a7a1a' : '#b02020'
  ctx.fillRect(x + 10, y + 20, 32, 24)

  ctx.fillStyle = '#f5c58a'
  ctx.fillRect(x + 12, y + 7, 28, 19)

  ctx.fillStyle = isP2 ? '#1a7a1a' : '#b02020'
  ctx.fillRect(x + 7,  y + 4, 38, 8)
  ctx.fillRect(x + 13, y - 3, 26, 9)

  ctx.fillStyle = '#222'
  ctx.fillRect(x + 17, y + 12, 4, 4)
  ctx.fillRect(x + 31, y + 12, 4, 4)

  ctx.fillStyle = '#4a2808'
  ctx.fillRect(x + 15, y + 20, 22, 4)

  if (isP2) {
    ctx.fillStyle = 'rgba(255,255,255,0.5)'
    ctx.fillRect(x + 13, y + 1, 26, 3)
  }
}

function drawFogOverlay(ctx, playerPos, rows, cols, radius) {
  const offscreen = document.createElement('canvas')
  offscreen.width  = cols * CS
  offscreen.height = rows * CS
  const oc = offscreen.getContext('2d')

  oc.fillStyle = 'rgba(0,0,0,0.97)'
  oc.fillRect(0, 0, offscreen.width, offscreen.height)

  if (playerPos) {
    const cx = playerPos.c * CS + CS / 2
    const cy = playerPos.r * CS + CS / 2
    const r  = radius * CS
    const grad = oc.createRadialGradient(cx, cy, 0, cx, cy, r)
    grad.addColorStop(0,    'rgba(0,0,0,1)')
    grad.addColorStop(0.65, 'rgba(0,0,0,1)')
    grad.addColorStop(1,    'rgba(0,0,0,0)')
    oc.globalCompositeOperation = 'destination-out'
    oc.fillStyle = grad
    oc.beginPath()
    oc.arc(cx, cy, r, 0, Math.PI * 2)
    oc.fill()
  }

  ctx.drawImage(offscreen, 0, 0)
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath()
  ctx.moveTo(x + r, y)
  ctx.lineTo(x + w - r, y);    ctx.arcTo(x+w, y,   x+w, y+r,   r)
  ctx.lineTo(x + w, y+h - r);  ctx.arcTo(x+w, y+h, x+w-r,y+h,  r)
  ctx.lineTo(x + r, y + h);    ctx.arcTo(x,   y+h, x,   y+h-r, r)
  ctx.lineTo(x,     y + r);    ctx.arcTo(x,   y,   x+r, y,     r)
  ctx.closePath()
}