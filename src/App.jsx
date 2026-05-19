import React, { useState } from 'react'
import PageShell  from './components/layout/PageShell.jsx'
import HubScreen  from './components/hub/HubScreen.jsx'
import LevelScreen from './components/canvas/LevelScreen.jsx'
import { getTheme } from './config/themeConfig.js'
import styles from './App.module.css'

export default function App() {
  // scene: 'hub' | { level: number }
  const [scene, setScene] = useState('hub')

  const theme = getTheme(scene === 'hub' ? 'hub' : scene.level)

  function goHub() {
    setScene('hub')
  }

  function enterLevel(levelId) {
    setScene({ level: levelId })
  }

  return (
    <PageShell>
      <div
        className={styles.field}
        style={{
          '--field-bg':    theme.fieldBg,
          '--strip-bg':    theme.stripBg,
          '--accent':      theme.accentTop,
        }}
      >
        {scene === 'hub' ? (
          <HubScreen onEnterLevel={enterLevel} />
        ) : (
          <LevelScreen levelNum={scene.level} onHub={goHub} />
        )}
      </div>
    </PageShell>
  )
}