import { useCallback, useEffect, useState } from 'react'
import { api } from '../api'
import { Alert, Empty, Field, Loading, Modal } from '../components/ui'

const VAZIO = { matricula: '', ano: '', marca: '', modelo: '', placa: '' }

function AutomovelForm({ onSalvar, onClose }) {
  const [form, setForm] = useState(VAZIO)
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      await onSalvar({
        matricula: form.matricula.trim(),
        ano: Number(form.ano),
        marca: form.marca.trim(),
        modelo: form.modelo.trim(),
        placa: form.placa.trim().toUpperCase(),
      })
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  return (
    <Modal titulo="Cadastrar automóvel" onClose={onClose}>
      <form className="form" onSubmit={handleSubmit}>
        <Alert onClose={() => setErro('')}>{erro}</Alert>
        <div className="grid-2">
          <Field label="Marca">
            <input value={form.marca} onChange={set('marca')} required />
          </Field>
          <Field label="Modelo">
            <input value={form.modelo} onChange={set('modelo')} required />
          </Field>
          <Field label="Ano">
            <input type="number" min="1950" max="2100" value={form.ano} onChange={set('ano')} required />
          </Field>
          <Field label="Placa">
            <input value={form.placa} onChange={set('placa')} required placeholder="ABC1D23" maxLength={8} />
          </Field>
          <Field label="Matrícula" full>
            <input value={form.matricula} onChange={set('matricula')} required />
          </Field>
        </div>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={enviando}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando ? 'Salvando...' : 'Cadastrar'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

export default function Automoveis({ usuario }) {
  const agente = usuario.perfil === 'AGENTE'
  const [automoveis, setAutomoveis] = useState(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [criando, setCriando] = useState(false)

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setAutomoveis((await api.get('/api/automoveis')) || [])
    } catch (err) {
      setErro(err.message)
      setAutomoveis((atual) => atual || [])
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const fechar = useCallback(() => setCriando(false), [])

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            Frota{automoveis ? ` · ${automoveis.length} ${automoveis.length === 1 ? 'veículo' : 'veículos'}` : ''}
          </span>
          <h1>Automóveis</h1>
          <p className="muted">Veículos disponíveis para pedidos de aluguel.</p>
        </div>
        {agente && (
          <button type="button" className="btn btn-primary" onClick={() => setCriando(true)}>
            + Novo automóvel
          </button>
        )}
      </div>

      <Alert onClose={() => setErro('')}>{erro}</Alert>
      <Alert tipo="sucesso" onClose={() => setSucesso('')}>
        {sucesso}
      </Alert>

      {automoveis === null ? (
        <Loading texto="Carregando automóveis..." />
      ) : automoveis.length === 0 ? (
        <Empty titulo="Nenhum automóvel cadastrado">{agente ? 'Cadastre o primeiro automóvel da frota.' : null}</Empty>
      ) : (
        <div className="table-wrap card">
          <table className="table">
            <thead>
              <tr>
                <th>Marca / modelo</th>
                <th>Ano</th>
                <th>Placa</th>
                <th>Matrícula</th>
              </tr>
            </thead>
            <tbody>
              {automoveis.map((a) => (
                <tr key={a.id}>
                  <td data-label="Marca / modelo">
                    <strong>
                      {a.marca} {a.modelo}
                    </strong>
                  </td>
                  <td data-label="Ano" className="mono">{a.ano}</td>
                  <td data-label="Placa">
                    <span className="placa">{a.placa}</span>
                  </td>
                  <td data-label="Matrícula" className="mono">{a.matricula}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {criando && (
        <AutomovelForm
          onClose={fechar}
          onSalvar={async (corpo) => {
            await api.post('/api/automoveis', corpo)
            setCriando(false)
            setSucesso('Automóvel cadastrado.')
            await carregar()
          }}
        />
      )}
    </div>
  )
}
