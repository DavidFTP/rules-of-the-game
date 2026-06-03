import React, { useState } from 'react'
import PageShell   from './components/layout/PageShell.jsx'
import HubScreen   from './components/screens/HubScreen.jsx'
import LevelScreen from './components/screens/LevelScreen.jsx'
import { getTheme } from './config/themeConfig.js'
import styles from './App.module.css'

export default function App() {
  const [scene, setScene] = useState('hub')
  const theme = getTheme(scene === 'hub' ? 'hub' : scene.level)

  return (
    <PageShell>
      <div
        className={styles.field}
        style={{
          '--field-bg': theme.fieldBg,
          '--strip-bg': theme.stripBg,
          '--accent':   theme.accentTop,
        }}
      >
        {scene === 'hub'
          ? <HubScreen   onEnterLevel={(id) => setScene({ level: id })} />
          : <LevelScreen levelNum={scene.level} onHub={() => setScene('hub')} />
        }
      </div>
    </PageShell>
  )
}
