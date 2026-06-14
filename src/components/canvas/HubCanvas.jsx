import React, { useEffect, useRef } from 'react'
import { hubMap, hubDoors } from '../../levels/hub/hubData.js'
import { dirToSpriteKey } from '../../config/spriteConfig.js'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import styles from './HubCanvas.module.css'

const CS         = 72
const VIEWPORT_W = 13
const VIEWPORT_H = 9
const GRID       = hubMap.map(line => line.split(''))

function isDoor(r, c) { return hubDoors.some(d => d.row === r && d.col === c) }
function getDoor(r, c) { return hubDoors.find(d => d.row === r && d.col === c) ?? null }

function getCameraOrigin(p) {
  const mapRows = GRID.length
  const mapCols = GRID[0].length
  let camC = p.c - Math.floor(VIEWPORT_W / 2)
  let camR = p.r - Math.floor(VIEWPORT_H / 2)
  camC = Math.max(0, Math.min(camC, mapCols - VIEWPORT_W))
  camR = Math.max(0, Math.min(camR, mapRows - VIEWPORT_H))
  return { camR, camC }
}

/**
 * HubCanvas — draws only. Receives playerRef and nearestDoor from parent.
 * Runs its own RAF loop because the hub world animates (door glow pulses).
 * No logic. No input handling. No state.
 */
export default function HubCanvas({ playerRef, nearestDoor, images = null }) {
  const { t } = useLanguage()
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    canvas.width  = VIEWPORT_W * CS
    canvas.height = VIEWPORT_H * CS
  }, [])

  useEffect(() => {
    function draw() {
      const canvas = canvasRef.current
      if (!canvas || !playerRef?.current) return
      const ctx = canvas.getContext('2d')
      const p   = playerRef.current
      const { camR, camC } = getCameraOrigin(p)

      ctx.clearRect(0, 0, canvas.width, canvas.height)

      for (let vr = 0; vr < VIEWPORT_H; vr++) {
        for (let vc = 0; vc < VIEWPORT_W; vc++) {
          const gr = camR + vr
          const gc = camC + vc
          const x  = vc * CS
          const y  = vr * CS
          if (gr < 0 || gc < 0 || gr >= GRID.length || gc >= GRID[0].length) continue

          const ch = GRID[gr][gc]

          if (ch === '#') {
            if (images?.tiles?.wall instanceof HTMLImageElement) {
              ctx.drawImage(images.tiles.wall, x, y, CS, CS)
            } else {
              ctx.fillStyle = '#2a1a0a'
              ctx.fillRect(x, y, CS, CS)
              const bh = Math.floor(CS / 3)
              ctx.fillStyle = '#3d2810'
              for (let bi = 0; bi < 3; bi++) {
                const off = bi % 2 === 0 ? 0 : Math.floor(CS / 2)
                ctx.fillRect(x+off+1,              y+bi*bh+1, Math.floor(CS/2)-3, bh-2)
                ctx.fillRect(x+off+Math.floor(CS/2)+1, y+bi*bh+1, Math.floor(CS/2)-3, bh-2)
              }
            }
          } else if (isDoor(gr, gc)) {
            const door  = getDoor(gr, gc)
            const pulse = (Math.sin(Date.now() / 500) + 1) / 2
            ctx.fillStyle = '#1a1a4a'
            ctx.fillRect(x, y, CS, CS)
            ctx.fillStyle = '#2a2a80'
            ctx.fillRect(x+8, y+5, CS-16, CS-8)
            ctx.fillStyle = '#3a3aaa'
            ctx.fillRect(x+12, y+9, (CS-24)/2-2, CS-20)
            ctx.fillRect(x+12+(CS-24)/2+2, y+9, (CS-24)/2-2, CS-20)
            ctx.fillStyle = '#f5a623'
            ctx.beginPath()
            ctx.arc(x+CS/2, y+CS*0.6, 4, 0, Math.PI*2)
            ctx.fill()
            ctx.shadowColor = '#f5a623'
            ctx.shadowBlur  = 6 + pulse * 18
            ctx.strokeStyle = `rgba(245,166,35,${0.5 + pulse*0.5})`
            ctx.lineWidth   = 2.5
            ctx.strokeRect(x+3, y+3, CS-6, CS-6)
            ctx.shadowBlur  = 0
            if (door) {
              ctx.fillStyle = '#f5a623'
              ctx.font = `bold ${Math.floor(CS*0.32)}px monospace`
              ctx.textAlign = 'center'
              ctx.fillText(String(door.id), x+CS/2, y+CS*0.38)
            }
          } else {
            if (images?.tiles?.floor instanceof HTMLImageElement) {
              ctx.drawImage(images.tiles.floor, x, y, CS, CS)
            } else {
              ctx.fillStyle = (gr+gc)%2===0 ? '#1e3a1e' : '#1a3218'
              ctx.fillRect(x, y, CS, CS)
              if ((gr+gc)%4===0) {
                ctx.fillStyle = 'rgba(80,160,80,0.18)'
                ctx.fillRect(x+CS*0.2, y+CS*0.6, 4, 8)
                ctx.fillRect(x+CS*0.6, y+CS*0.5, 4, 10)
              }
            }
          }
        }
      }

      // Player
      const px = (p.c - camC) * CS
      const py = (p.r - camR) * CS
      drawCharacter(ctx, px, py, CS, images, p.dir ?? 'down')

      // "Tap E" prompt
      const near = nearestDoor?.()
      if (near) {
        const dx = (near.col - camC) * CS + CS/2
        const dy = (near.row - camR) * CS - 8
        if (dx > 0 && dy > 0 && dx < canvas.width && dy < canvas.height) {
          ctx.fillStyle = 'rgba(0,0,0,0.75)'
          ctx.fillRect(dx-80, dy-18, 160, 22)
          ctx.fillStyle = '#f5a623'
          ctx.font = 'bold 11px monospace'
          ctx.textAlign = 'center'
          ctx.fillText(t('hubCanvas.pressToEnter'), dx, dy)
        }
      }
    }

    function loop() { draw(); rafRef.current = requestAnimationFrame(loop) }
    rafRef.current = requestAnimationFrame(loop)
    return () => cancelAnimationFrame(rafRef.current)
  }, [playerRef, nearestDoor, images, t])

  return (
    <div className={styles.wrap}>
      <canvas ref={canvasRef} className={styles.canvas} />
    </div>
  )
}

function drawCharacter(ctx, x, y, cs, images = null, playerDir = 'down') {
  // Try sprite image first, using direction-based sprite key
  const spriteKey = dirToSpriteKey(playerDir)
  const img = images?.sprites?.[spriteKey]
  if (img instanceof HTMLImageElement) {
    ctx.drawImage(img, x+6, y+2, cs-12, cs-12)
    return
  }
  ctx.fillStyle = 'rgba(0,0,0,0.35)'
  ctx.beginPath()
  ctx.ellipse(x+cs/2, y+cs-6, cs*0.28, cs*0.1, 0, 0, Math.PI*2)
  ctx.fill()
  ctx.fillStyle = '#b02020'
  ctx.fillRect(x+cs*0.2,  y+cs*0.42, cs*0.6,  cs*0.45)
  ctx.fillStyle = '#f5c58a'
  ctx.fillRect(x+cs*0.24, y+cs*0.16, cs*0.52, cs*0.34)
  ctx.fillStyle = '#b02020'
  ctx.fillRect(x+cs*0.12, y+cs*0.10, cs*0.76, cs*0.14)
  ctx.fillRect(x+cs*0.26, y-cs*0.04, cs*0.48, cs*0.16)
  ctx.fillStyle = '#222'
  ctx.fillRect(x+cs*0.31, y+cs*0.24, cs*0.09, cs*0.09)
  ctx.fillRect(x+cs*0.60, y+cs*0.24, cs*0.09, cs*0.09)
  ctx.fillStyle = '#4a2808'
  ctx.fillRect(x+cs*0.28, y+cs*0.38, cs*0.44, cs*0.08)
}
