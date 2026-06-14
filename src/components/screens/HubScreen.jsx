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
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import styles from './HubScreen.module.css'

export default function HubScreen({ onEnterLevel }) {
  const { t } = useLanguage()
  const [pendingDoor, setPendingDoor] = useState(null)
  const canvasAreaRef = useRef(null)
  const isTouch       = useTouchDevice()
  const { images } = useAssets()

  const { playerRef, movePlayer, nearestDoor } = useHubPlayer(
    (door) => setPendingDoor(door)
  )

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
              label={t('topStrip.moveLabel')}
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
