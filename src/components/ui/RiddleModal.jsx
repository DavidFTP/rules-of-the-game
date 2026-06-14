import React, { useState, useEffect, useRef } from 'react'
import Modal, { ModalTitle, ModalBody, ModalError, Btn } from './Modal.jsx'
import { useLanguage } from '../../i18n/LanguageContext.jsx'

export default function RiddleModal({ door, onSuccess, onClose }) {
  const { t, riddles } = useLanguage()
  const riddle = riddles.find(r => r.id === door.id) ?? riddles[0]
  const [value, setValue]   = useState('')
  const [error, setError]   = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 60)
  }, [])

  function submit() {
    if (value.trim().toLowerCase() === riddle.answer.toLowerCase()) {
      onSuccess(door.id)
    } else {
      setError(t('riddle.notQuite'))
      setValue('')
      inputRef.current?.focus()
    }
  }

  return (
    <Modal onClose={onClose}>
      <ModalTitle>🚪 {t(door.labelKey, { n: door.id })}</ModalTitle>
      <ModalBody>
        {t('riddle.enterPrompt')}
      </ModalBody>
      <p style={{ color: 'var(--gold)', fontStyle: 'italic', marginBottom: 20, fontSize: 14, lineHeight: 1.7 }}>
        "{riddle.question}"
      </p>
      <input
        ref={inputRef}
        type="text"
        value={value}
        onChange={e => { setValue(e.target.value); setError('') }}
        onKeyDown={e => e.key === 'Enter' && submit()}
        placeholder={t('riddle.yourAnswer')}
        style={{
          width: '100%',
          padding: '10px 14px',
          background: 'rgba(255,255,255,0.07)',
          border: '1px solid rgba(255,255,255,0.2)',
          borderRadius: 'var(--radius)',
          color: '#fff',
          fontFamily: 'var(--font-body)',
          fontSize: 15,
          outline: 'none',
          marginBottom: 12,
          textAlign: 'center',
        }}
      />
      <ModalError>{error}</ModalError>
      <Btn variant="gold" onClick={submit}>{t('riddle.enter')}</Btn>
      <Btn variant="secondary" onClick={onClose}>{t('riddle.goBack')}</Btn>
    </Modal>
  )
}
