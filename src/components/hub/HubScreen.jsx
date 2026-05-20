import React, { useState } from 'react'
import HubScene    from '../hub/HubScene.jsx'
import TopStrip    from '../layout/TopStrip.jsx'
import BottomStrip from '../layout/BottomStrip.jsx'
import RiddleModal from '../ui/RiddleModal.jsx'
import styles from './HubScreen.module.css'

export default function HubScreen({ onEnterLevel }) {
  const [pendingDoor, setPendingDoor] = useState(null)

  function handleDoorApproach(door) {
    setPendingDoor(door)
  }

  function handleRiddleSuccess(levelId) {
    setPendingDoor(null)
    onEnterLevel(levelId)
  }

  return (
    <div className={styles.wrap}>
      <TopStrip config={null} state={null} />

      <div className={styles.canvas}>
        <HubScene onEnterLevel={handleDoorApproach} />

        {pendingDoor && (
          <RiddleModal
            door={pendingDoor}
            onSuccess={handleRiddleSuccess}
            onClose={() => setPendingDoor(null)}
          />
        )}
      </div>

      <BottomStrip config={null} state={null} />
    </div>
  )
}
