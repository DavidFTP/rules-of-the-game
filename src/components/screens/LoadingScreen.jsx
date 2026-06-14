import React from 'react'
import styles from './LoadingScreen.module.css'
import { useLanguage } from '../../i18n/LanguageContext.jsx'

export default function LoadingScreen({ progress = {}, error = null }) {
  const { t } = useLanguage()
  const { loaded = 0, total = 0 } = progress
  const percent = total > 0 ? Math.round((loaded / total) * 100) : 0

  return (
    <div className={styles.screen}>
      <div className={styles.container}>
        <div className={styles.title}>{error ? t('loading.errorTitle') : t('loading.title')}</div>
        
        {error ? (
          <div className={styles.errorBox}>
            <p>{t('loading.sorry')}</p>
            <pre>{String(error.message)}</pre>
            <p>{t('loading.refresh')}</p>
          </div>
        ) : (
          <>
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
              {total > 0 ? t('loading.progress', { loaded, total }) : t('loading.initializing')}
            </div>

            <div className={styles.message}>
              {t('loading.gettingReady')}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
