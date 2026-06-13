import React, { useState } from 'react'
import PageShell   from './components/layout/PageShell.jsx'
import HubScreen   from './components/screens/HubScreen.jsx'
import LevelScreen from './components/screens/LevelScreen.jsx'
import LoadingScreen from './components/screens/LoadingScreen.jsx'
import { AssetProvider, useAssets } from './contexts/AssetContext.jsx'
import { getTheme } from './config/themeConfig.js'
import styles from './App.module.css'

function AppContent() {
  const [scene, setScene] = useState('hub')
  const { isLoading, progress } = useAssets()
  const theme = getTheme(scene === 'hub' ? 'hub' : scene.level)

  if (isLoading) {
    return <LoadingScreen progress={progress} />
  }

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

export default function App() {
  return (
    <AssetProvider>
      <AppContent />
    </AssetProvider>
  )
}
