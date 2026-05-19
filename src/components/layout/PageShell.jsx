import React from 'react'
import styles from './PageShell.module.css'

export default function PageShell({ children }) {
  return (
    <div className={styles.shell}>
      <aside className={styles.side} aria-hidden="true">
        <span className={styles.deco}>THE WAY • SOKOBAN • THE WAY • SOKOBAN •</span>
      </aside>

      <main className={styles.field}>
        {children}
      </main>

      <aside className={styles.side} aria-hidden="true">
        <span className={styles.deco}>LEARN • GROW • PLAY • LEARN • GROW •</span>
      </aside>
    </div>
  )
}