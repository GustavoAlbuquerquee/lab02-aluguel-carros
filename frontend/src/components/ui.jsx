import { useEffect, useState } from 'react'
import { STATUS } from '../util'

export function StatusBadge({ status }) {
  return <span className={`badge badge-${String(status).toLowerCase()}`}>{STATUS[status] || status}</span>
}

export function Alert({ children, tipo = 'erro', onClose }) {
  if (!children) return null
  return (
    <div className={`alert alert-${tipo}`} role={tipo === 'erro' ? 'alert' : 'status'}>
      <span>{children}</span>
      {onClose && (
        <button type="button" className="alert-close" onClick={onClose} aria-label="Fechar">
          ×
        </button>
      )}
    </div>
  )
}

export function Loading({ texto = 'Carregando...' }) {
  return (
    <div className="loading">
      <span className="spinner" aria-hidden="true" />
      {texto}
    </div>
  )
}

export function Empty({ titulo, children }) {
  return (
    <div className="empty">
      <strong>{titulo}</strong>
      {children && <p>{children}</p>}
    </div>
  )
}

export function Modal({ titulo, onClose, children, largo = false }) {
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKey)
    const overflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = overflow
    }
  }, [onClose])

  return (
    <div className="modal-backdrop" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal${largo ? ' modal-lg' : ''}`} role="dialog" aria-modal="true" aria-label={titulo}>
        <header className="modal-header">
          <h2>{titulo}</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="Fechar">
            ×
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  )
}

export function Confirm({ titulo, mensagem, confirmarLabel = 'Confirmar', perigo = false, onConfirm, onClose }) {
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const confirmar = async () => {
    setErro('')
    setEnviando(true)
    try {
      await onConfirm()
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  return (
    <Modal titulo={titulo} onClose={onClose}>
      <Alert onClose={() => setErro('')}>{erro}</Alert>
      <p>{mensagem}</p>
      <div className="form-actions">
        <button type="button" className="btn btn-ghost" onClick={onClose} disabled={enviando}>
          Voltar
        </button>
        <button
          type="button"
          className={`btn ${perigo ? 'btn-danger' : 'btn-primary'}`}
          onClick={confirmar}
          disabled={enviando}
        >
          {enviando ? 'Aguarde...' : confirmarLabel}
        </button>
      </div>
    </Modal>
  )
}

export function Field({ label, children, hint, full = false }) {
  return (
    <label className={`field${full ? ' field-full' : ''}`}>
      <span className="field-label">{label}</span>
      {children}
      {hint && <span className="field-hint">{hint}</span>}
    </label>
  )
}
