import React from 'react'
import styles from './LoadingScreen.module.css'

export default function LoadingScreen({ progress = {} }) {
  const { loaded = 0, total = 0 } = progress
  const percent = total > 0 ? Math.round((loaded / total) * 100) : 0

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.title}>Loading Game...</div>
        
        <div className={styles.spinnerWrapper}>
          <div className={styles.spinner}></div>
        </div>

        <div className={styles.progressBar}>
          <div 
            className={styles.progressFill}
            style={{ width: `${percent}%` }}
          ></div>
        </div>

        <div className={styles.progressText}>
          {total > 0 ? `${loaded} / ${total} assets` : 'Initializing...'}
        </div>

        <div className={styles.message}>
          Getting your game ready...
        </div>
      </div>
    </div>
  )
}
