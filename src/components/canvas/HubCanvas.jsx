import React, { useEffect, useRef, useState } from 'react'
import { hubMap, hubDoors } from '../../levels/hub/hubData.js'
import { dirToSpriteKey } from '../../config/spriteConfig.js'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import styles from './HubCanvas.module.css'

const GRID = hubMap.map(line => line.split(''))
const MAP_COLS = GRID[0].length
const MAP_ROWS = GRID.length
const TARGET_CELLS = 13 * 9

function computeViewport(containerW, containerH) {
  const aspect = containerW / containerH
  let cols = Math.round(Math.sqrt(TARGET_CELLS * aspect))
  let rows = Math.round(Math.sqrt(TARGET_CELLS / aspect))
  cols = Math.max(8, Math.min(20, cols, MAP_COLS))
  rows = Math.max(4, Math.min(MAP_ROWS, rows))
  const cs = Math.min(containerW / cols, containerH / rows) * 0.9
  return { cs, vw: cols, vh: rows, cw: Math.round(cols * cs), ch: Math.round(rows * cs) }
}

function isDoor(r, c) { return hubDoors.some(d => d.row === r && d.col === c) }
function getDoor(r, c) { return hubDoors.find(d => d.row === r && d.col === c) ?? null }

function getCameraOrigin(p, vw, vh) {
  let camC = p.c - Math.floor(vw / 2)
  let camR = p.r - Math.floor(vh / 2)
  camC = Math.max(0, Math.min(camC, MAP_COLS - vw))
  camR = Math.max(0, Math.min(camR, MAP_ROWS - vh))
  return { camR, camC }
}

/**
 * HubCanvas — draws only. Receives playerRef and nearestDoor from parent.
 * Runs its own RAF loop because the hub world animates (door glow pulses).
 * No logic. No input handling. No state.
 */
export default function HubCanvas({ playerRef, nearestDoor, images = null, isTouch = false, dpadVisible = false, onAction }) {
  const { t } = useLanguage()
  const canvasRef = useRef(null)
  const rafRef    = useRef(null)
  const [nearDoor, setNearDoor] = useState(null)

  const wrapRef = useRef(null)
  const dimsRef = useRef(computeViewport(800, 600))

  useEffect(() => {
    const wrap = wrapRef.current
    if (!wrap) return
    function handleResize() {
      const { clientWidth: cw, clientHeight: ch } = wrap
      if (cw === 0 || ch === 0) return
      const dims = computeViewport(cw, ch)
      dimsRef.current = dims
      const canvas = canvasRef.current
      if (canvas) {
        canvas.width = dims.cw
        canvas.height = dims.ch
      }
    }
    const ro = new ResizeObserver(handleResize)
    ro.observe(wrap)
    handleResize()
    return () => ro.disconnect()
  }, [])

  useEffect(() => {
    function draw() {
      const canvas = canvasRef.current
      if (!canvas || !playerRef?.current) return
      const ctx = canvas.getContext('2d')
      const p   = playerRef.current
      const { cs, vw, vh, cw, ch } = dimsRef.current
      const { camR, camC } = getCameraOrigin(p, vw, vh)

      ctx.clearRect(0, 0, cw, ch)

      for (let vr = 0; vr < vh; vr++) {
        for (let vc = 0; vc < vw; vc++) {
          const gr = camR + vr
          const gc = camC + vc
          const x  = vc * cs
          const y  = vr * cs
          if (gr < 0 || gc < 0 || gr >= GRID.length || gc >= GRID[0].length) continue

          const cell = GRID[gr][gc]

          if (cell === '#') {
            if (images?.tiles?.wall instanceof HTMLImageElement) {
              ctx.drawImage(images.tiles.wall, x, y, cs, cs)
            } else {
              ctx.fillStyle = '#2a1a0a'
              ctx.fillRect(x, y, cs, cs)
              const bh = Math.floor(cs / 3)
              ctx.fillStyle = '#3d2810'
              for (let bi = 0; bi < 3; bi++) {
                const off = bi % 2 === 0 ? 0 : Math.floor(cs / 2)
                ctx.fillRect(x+off+1,              y+bi*bh+1, Math.floor(cs/2)-3, bh-2)
                ctx.fillRect(x+off+Math.floor(cs/2)+1, y+bi*bh+1, Math.floor(cs/2)-3, bh-2)
              }
            }
          } else if (isDoor(gr, gc)) {
            const door  = getDoor(gr, gc)
            const pulse = (Math.sin(Date.now() / 500) + 1) / 2
            ctx.fillStyle = '#1a1a4a'
            ctx.fillRect(x, y, cs, cs)
            ctx.fillStyle = '#2a2a80'
            ctx.fillRect(x+8, y+5, cs-16, cs-8)
            ctx.fillStyle = '#3a3aaa'
            ctx.fillRect(x+12, y+9, (cs-24)/2-2, cs-20)
            ctx.fillRect(x+12+(cs-24)/2+2, y+9, (cs-24)/2-2, cs-20)
            ctx.fillStyle = '#f5a623'
            ctx.beginPath()
            ctx.arc(x+cs/2, y+cs*0.6, 4, 0, Math.PI*2)
            ctx.fill()
            ctx.shadowColor = '#f5a623'
            ctx.shadowBlur  = 6 + pulse * 18
            ctx.strokeStyle = `rgba(245,166,35,${0.5 + pulse*0.5})`
            ctx.lineWidth   = 2.5
            ctx.strokeRect(x+3, y+3, cs-6, cs-6)
            ctx.shadowBlur  = 0
            if (door) {
              ctx.fillStyle = '#f5a623'
              ctx.font = `bold ${Math.floor(cs*0.32)}px monospace`
              ctx.textAlign = 'center'
              ctx.fillText(String(door.id), x+cs/2, y+cs*0.38)
            }
          } else {
            if (images?.tiles?.floor instanceof HTMLImageElement) {
              ctx.drawImage(images.tiles.floor, x, y, cs, cs)
            } else {
              ctx.fillStyle = (gr+gc)%2===0 ? '#1e3a1e' : '#1a3218'
              ctx.fillRect(x, y, cs, cs)
              if ((gr+gc)%4===0) {
                ctx.fillStyle = 'rgba(80,160,80,0.18)'
                ctx.fillRect(x+cs*0.2, y+cs*0.6, 4, 8)
                ctx.fillRect(x+cs*0.6, y+cs*0.5, 4, 10)
              }
            }
          }
        }
      }

      // Player
      const px = (p.c - camC) * cs
      const py = (p.r - camR) * cs
      drawCharacter(ctx, px, py, cs, images, p.dir ?? 'down')

      // Track nearest door for the floating button
      const near = nearestDoor?.()
      setNearDoor(prev => {
        const prevId = prev?.id ?? null
        const newId  = near?.id ?? null
        return prevId !== newId ? near : prev
      })

      if (near) {
        const dx = (near.col - camC) * cs + cs/2
        const dy = (near.row - camR) * cs - 8
        if (dx > 0 && dy > 0 && dx < cw && dy < ch) {
          ctx.fillStyle = 'rgba(0,0,0,0.75)'
          ctx.fillRect(dx-85, dy-18, 170, 22)
          ctx.fillStyle = '#f5a623'
          ctx.font = 'bold 16px monospace'
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
    <div className={styles.wrap} ref={wrapRef}>
      <canvas ref={canvasRef} className={styles.canvas} />
      {nearDoor && isTouch && !dpadVisible && (
        <button className={styles.doorBtn} onClick={onAction}>✦</button>
      )}
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
