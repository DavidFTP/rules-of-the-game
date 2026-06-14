import { createContext, useContext, useState, useCallback, useEffect } from 'react'
import en from './en.json'
import ar from './ar.json'
import enRiddles from './enRiddles.js'
import arRiddles from './arRiddles.js'
import './rtl.css'

const STORAGE_KEY = 'rotg-lang'

const dictionaries = { en, ar }
const riddlesMap = { en: enRiddles, ar: arRiddles }

function getInitialLang() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored === 'en' || stored === 'ar') return stored
  } catch { /* localStorage unavailable */ }
  return 'ar'
}

export const LanguageContext = createContext(null)

export function LanguageProvider({ children }) {
  const [lang, setLang] = useState(getInitialLang)

  useEffect(() => {
    const dir = lang === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = lang
    document.documentElement.dir = dir
    try { localStorage.setItem(STORAGE_KEY, lang) } catch { /* localStorage unavailable */ }
  }, [lang])

  const t = useCallback((key, params = {}) => {
    const dict = dictionaries[lang] || en
    let text = dict[key]
    if (text === undefined) {
      text = dictionaries.en[key]
    }
    if (text === undefined) return key
    if (Object.keys(params).length === 0) return text
    return text.replace(/\{(\w+)\}/g, (_, k) => params[k] ?? `{${k}}`)
  }, [lang])

  const toggleLang = useCallback(() => {
    setLang(prev => prev === 'ar' ? 'en' : 'ar')
  }, [])

  const isRTL = lang === 'ar'
  const riddles = riddlesMap[lang] || enRiddles

  const value = { lang, t, toggleLang, isRTL, riddles }

  return (
    <LanguageContext.Provider value={value}>
      {children}
    </LanguageContext.Provider>
  )
}

export function useLanguage() {
  const ctx = useContext(LanguageContext)
  if (!ctx) throw new Error('useLanguage must be used within <LanguageProvider>')
  return ctx
}
