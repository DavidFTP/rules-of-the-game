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

const DPAD_POSITIONS = ['none', 'center', 'left', 'right']

export default function HubScreen({ onEnterLevel }) {
  const { t } = useLanguage()
  const [pendingDoor, setPendingDoor] = useState(null)
  const [dpadPos, setDpadPos] = useState('none')
  const canvasAreaRef = useRef(null)
  const isTouch       = useTouchDevice()
  const { images } = useAssets()

  const { playerRef, movePlayer, nearestDoor } = useHubPlayer(
    (door) => setPendingDoor(door)
  )

  function cycleDpadPos() {
    setDpadPos(prev => {
      const idx = DPAD_POSITIONS.indexOf(prev)
      return DPAD_POSITIONS[(idx + 1) % DPAD_POSITIONS.length]
    })
  }

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
          <>
            {dpadPos !== 'none' && (
              <div className={`${styles.touchControls} ${styles['touchControls' + (dpadPos.charAt(0).toUpperCase() + dpadPos.slice(1))]}`}>
                <DPad
                  compact
                  label={t('topStrip.moveLabel')}
                  onMove={movePlayer}
                  onAction={() => movePlayer('Enter')}
                />
              </div>
            )}
            <div className={styles.dpadToggleWrap}>
              <button
                className={styles.dpadToggleBtn}
                onClick={cycleDpadPos}
                aria-label={t('hubScreen.controls')}
              >
                <span className={styles.dpadToggleLabel}>{t('hubScreen.controls')}</span>
              </button>
            </div>
          </>
        )}
      </div>

      <BottomStrip config={null} state={null} />
    </div>
  )
}
