import React from 'react'
import styles from './Modal.module.css'

export default function Modal({ children, onClose }) {
  return (
    <div className={styles.overlay} onClick={e => { if (e.target === e.currentTarget) onClose?.() }}>
      <div className={styles.box}>
        {children}
      </div>
    </div>
  )
}

export function ModalTitle({ children }) {
  return <h2 className={styles.title}>{children}</h2>
}

export function ModalBody({ children }) {
  return <p className={styles.body}>{children}</p>
}

export function ModalError({ children }) {
  return <div className={styles.error}>{children || '\u00a0'}</div>
}

export function Btn({ children, variant = 'primary', ...props }) {
  return (
    <button className={`${styles.btn} ${styles[variant]}`} {...props}>
      {children}
    </button>
  )
}