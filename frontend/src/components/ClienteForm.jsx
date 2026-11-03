import { useState } from 'react'
import { Alert, Field } from './ui'

const MAX_RENDIMENTOS = 3

function estadoInicial(cliente) {
  return {
    nome: cliente?.nome || '',
    login: cliente?.login || '',
    senha: '',
    rg: cliente?.rg || '',
    cpf: cliente?.cpf || '',
    endereco: cliente?.endereco || '',
    profissao: cliente?.profissao || '',
    rendimentos: (cliente?.rendimentos || []).map((r) => ({
      entidadeEmpregadora: r.entidadeEmpregadora || '',
      valor: r.valor ?? '',
    })),
  }
}

export default function ClienteForm({ cliente, edicao = false, submitLabel = 'Salvar', onSubmit, onCancel }) {
  const [form, setForm] = useState(() => estadoInicial(cliente))
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const set = (campo) => (e) => setForm((f) => ({ ...f, [campo]: e.target.value }))

  const setRendimento = (index, campo, valor) =>
    setForm((f) => ({
      ...f,
      rendimentos: f.rendimentos.map((r, i) => (i === index ? { ...r, [campo]: valor } : r)),
    }))

  const addRendimento = () =>
    setForm((f) =>
      f.rendimentos.length >= MAX_RENDIMENTOS
        ? f
        : { ...f, rendimentos: [...f.rendimentos, { entidadeEmpregadora: '', valor: '' }] },
    )

  const removeRendimento = (index) =>
    setForm((f) => ({ ...f, rendimentos: f.rendimentos.filter((_, i) => i !== index) }))

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    const rendimentos = form.rendimentos
      .filter((r) => r.entidadeEmpregadora.trim() || String(r.valor).trim())
      .map((r) => ({ entidadeEmpregadora: r.entidadeEmpregadora.trim(), valor: Number(r.valor) }))
    if (rendimentos.some((r) => !r.entidadeEmpregadora || !(r.valor >= 0))) {
      setErro('Preencha a entidade empregadora e o valor de cada rendimento.')
      return
    }
    const dados = {
      nome: form.nome.trim(),
      login: form.login.trim(),
      rg: form.rg.trim(),
      cpf: form.cpf.trim(),
      endereco: form.endereco.trim(),
      profissao: form.profissao.trim(),
      rendimentos,
    }
    if (form.senha) dados.senha = form.senha
    setEnviando(true)
    try {
      await onSubmit(dados)
    } catch (err) {
      setErro(err.message)
    } finally {
      setEnviando(false)
    }
  }

  return (
    <form className="form" onSubmit={handleSubmit}>
      <Alert onClose={() => setErro('')}>{erro}</Alert>

      <fieldset className="form-section">
        <legend>Dados pessoais</legend>
        <div className="grid-2">
          <Field label="Nome completo" full>
            <input value={form.nome} onChange={set('nome')} required autoComplete="name" />
          </Field>
          <Field label="CPF">
            <input value={form.cpf} onChange={set('cpf')} required placeholder="000.000.000-00" inputMode="numeric" />
          </Field>
          <Field label="RG">
            <input value={form.rg} onChange={set('rg')} required placeholder="MG-00.000.000" />
          </Field>
          <Field label="Endereço" full>
            <input value={form.endereco} onChange={set('endereco')} required autoComplete="street-address" />
          </Field>
          <Field label="Profissão" full>
            <input value={form.profissao} onChange={set('profissao')} required />
          </Field>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>Acesso</legend>
        <div className="grid-2">
          <Field label="Usuário">
            <input value={form.login} onChange={set('login')} required autoComplete="username" />
          </Field>
          <Field label={edicao ? 'Nova senha' : 'Senha'} hint={edicao ? 'Deixe em branco para manter a senha atual.' : undefined}>
            <input
              type="password"
              value={form.senha}
              onChange={set('senha')}
              required={!edicao}
              minLength={edicao && !form.senha ? undefined : 6}
              autoComplete="new-password"
            />
          </Field>
        </div>
      </fieldset>

      <fieldset className="form-section">
        <legend>
          Rendimentos <span className="muted">({form.rendimentos.length}/{MAX_RENDIMENTOS})</span>
        </legend>
        {form.rendimentos.length === 0 && <p className="muted small">Nenhum rendimento informado.</p>}
        <div className="rendimentos">
          {form.rendimentos.map((r, i) => (
            <div className="rendimento-row" key={i}>
              <Field label="Entidade empregadora">
                <input
                  value={r.entidadeEmpregadora}
                  onChange={(e) => setRendimento(i, 'entidadeEmpregadora', e.target.value)}
                  required
                />
              </Field>
              <Field label="Valor mensal (R$)">
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={r.valor}
                  onChange={(e) => setRendimento(i, 'valor', e.target.value)}
                  required
                />
              </Field>
              <button type="button" className="btn btn-ghost btn-danger-text" onClick={() => removeRendimento(i)}>
                Remover
              </button>
            </div>
          ))}
        </div>
        <button
          type="button"
          className="btn btn-secondary btn-sm"
          onClick={addRendimento}
          disabled={form.rendimentos.length >= MAX_RENDIMENTOS}
        >
          + Adicionar rendimento
        </button>
      </fieldset>

      <div className="form-actions">
        {onCancel && (
          <button type="button" className="btn btn-ghost" onClick={onCancel} disabled={enviando}>
            Cancelar
          </button>
        )}
        <button type="submit" className="btn btn-primary" disabled={enviando}>
          {enviando ? 'Salvando...' : submitLabel}
        </button>
      </div>
    </form>
  )
}
