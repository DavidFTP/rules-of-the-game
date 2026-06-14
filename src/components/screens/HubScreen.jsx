import React, { useState, useRef } from 'react'
import HubCanvas   from '../canvas/HubCanvas.jsx'
import TopStrip    from '../layout/TopStrip.jsx'
import BottomStrip from '../layout/BottomStrip.jsx'
import DPad        from '../ui/DPad.jsx'
import RiddleModal from '../ui/RiddleModal.jsx'
import { useHubPlayer } from '../../hooks/useHubPlayer.js'
import { useSwipe }     from '../../hooks/useSwipe.js'
import { useTouchDevice } from '../../hooks/useTouchDevice.js'
import { useAssets } from '../../contexts/AssetContext.jsx'
import styles from './HubScreen.module.css'

/**
 * HubScreen — the full hub page.
 *
 * Responsibilities:
 *   - Owns the scene layout (TopStrip / canvas / BottomStrip / D-pad)
 *   - Owns the riddle modal state
 *   - Wires useHubPlayer (logic) → HubCanvas (draw) → DPad (input)
 *   - Wires useSwipe onto the canvas area for touch swipe movement
 */
export default function HubScreen({ onEnterLevel }) {
  const [pendingDoor, setPendingDoor] = useState(null)
  const canvasAreaRef = useRef(null)
  const isTouch       = useTouchDevice()
  const { images } = useAssets()

  const { playerRef, movePlayer, nearestDoor } = useHubPlayer(
    (door) => setPendingDoor(door)
  )

  // Swipe on the canvas area moves the player
  useSwipe(canvasAreaRef, movePlayer)

  return (
    <div className={styles.wrap}>
      <TopStrip config={null} state={null} />

      <div className={styles.canvasArea} ref={canvasAreaRef}>
        <HubCanvas playerRef={playerRef} nearestDoor={nearestDoor} images={images} />

        {pendingDoor && (
          <RiddleModal
            door={pendingDoor}
            onSuccess={(id) => { setPendingDoor(null); onEnterLevel(id) }}
            onClose={() => setPendingDoor(null)}
          />
        )}

        {isTouch && (
          <div className={styles.touchControls}>
            <DPad
              compact
              label="Move"
              onMove={movePlayer}
              onAction={() => movePlayer('Enter')}
            />
          </div>
        )}
      </div>

      <BottomStrip config={null} state={null} />
    </div>
  )
}
