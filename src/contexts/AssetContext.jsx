import React, { createContext, useContext, useState, useEffect } from 'react'
import { loadAssets } from '../config/spriteConfig.js'

const AssetContext = createContext(null)

export function AssetProvider({ children }) {
  const [images, setImages] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [progress, setProgress] = useState({ loaded: 0, total: 0 })
  const [error, setError] = useState(null)

  useEffect(() => {
    let mounted = true

    const handleProgress = (loaded, total, item) => {
      if (mounted) {
        setProgress({ loaded, total })
      }
    }

    loadAssets(handleProgress)
      .then(imgs => {
        if (mounted) {
          setImages(imgs)
          setIsLoading(false)
          console.log('🎮 All assets preloaded successfully')
        }
      })
      .catch(err => {
        if (mounted) {
          console.error('❌ Asset preload failed:', err)
          setError(err)
          setIsLoading(false)
        }
      })

    return () => { mounted = false }
  }, [])

  const value = {
    images,
    isLoading,
    progress,
    error,
  }

  return (
    <AssetContext.Provider value={value}>
      {children}
    </AssetContext.Provider>
  )
}

export function useAssets() {
  const context = useContext(AssetContext)
  if (!context) {
    throw new Error('useAssets must be used within <AssetProvider>')
  }
  return context
}
