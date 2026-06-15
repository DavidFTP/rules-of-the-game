import React from 'react'
import styles from './PageShell.module.css'
import { useLanguage } from '../../i18n/LanguageContext.jsx'
import bgImage from '../../assets/backgrounds/background.jpeg'

export default function PageShell({ children }) {
  const { t } = useLanguage()

  return (
    <div className={styles.shell}>
      <div className={styles.bg} style={{ backgroundImage: `url(${bgImage})` }} />
      <aside className={styles.side} aria-hidden="true">
        <span className={styles.deco}>{t('sidebar.left')}</span>
      </aside>

      <main className={styles.field}>
        {children}
      </main>

      <aside className={styles.side} aria-hidden="true">
        <span className={styles.deco}>{t('sidebar.right')}</span>
      </aside>
    </div>
  )
}