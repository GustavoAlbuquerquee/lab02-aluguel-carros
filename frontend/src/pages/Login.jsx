import { useState } from 'react'
import { login } from '../api'
import { Alert, Field } from '../components/ui'

const CONTAS = [
  { login: 'cliente', papel: 'Cliente' },
  { login: 'empresa', papel: 'Agente empresa' },
  { login: 'banco', papel: 'Agente banco' },
]

export default function Login({ onLogin, onCadastro, aviso }) {
  const [usuario, setUsuario] = useState('')
  const [senha, setSenha] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    setEnviando(true)
    try {
      const user = await login(usuario.trim(), senha)
      onLogin(user)
    } catch (err) {
      setErro(err.status === 401 ? 'Usuário ou senha inválidos.' : err.message)
      setEnviando(false)
    }
  }

  const preencher = (conta) => {
    setUsuario(conta)
    setSenha('123456')
    setErro('')
  }

  return (
    <div className="auth-page">
      <section className="auth-hero">
        <div className="brand brand-lg">
          <span className="brand-mark" aria-hidden="true">AC</span>
          <span>Aluguel de Carros</span>
        </div>
        <div>
          <h1>
            Do pedido ao <em>contrato</em>, sem papelada.
          </h1>
          <p>
            Clientes registram e acompanham seus pedidos de aluguel. Empresas e bancos avaliam, aprovam e executam
            os contratos, com concessão de crédito quando necessário.
          </p>
        </div>
        <ol className="auth-steps">
          <li>
            <span>01</span>Cliente faz o pedido
          </li>
          <li>
            <span>02</span>Agente avalia
          </li>
          <li>
            <span>03</span>Contrato executado
          </li>
        </ol>
      </section>

      <section className="auth-card card">
        <span className="eyebrow">Acesso ao sistema</span>
        <h2>Entrar</h2>
        <p className="muted">Informe seu usuário e senha para continuar.</p>
        <Alert tipo="sucesso">{aviso}</Alert>
        <Alert onClose={() => setErro('')}>{erro}</Alert>
        <form className="form" onSubmit={handleSubmit}>
          <Field label="Usuário">
            <input value={usuario} onChange={(e) => setUsuario(e.target.value)} required autoComplete="username" autoFocus />
          </Field>
          <Field label="Senha">
            <input
              type="password"
              value={senha}
              onChange={(e) => setSenha(e.target.value)}
              required
              autoComplete="current-password"
            />
          </Field>
          <button type="submit" className="btn btn-primary btn-block" disabled={enviando}>
            {enviando ? 'Entrando...' : 'Entrar'}
          </button>
        </form>
        <p className="auth-switch">
          Ainda não tem conta?{' '}
          <button type="button" className="link" onClick={onCadastro}>
            Cadastre-se como cliente
          </button>
        </p>
        <div className="hint-box">
          <strong>Contas de demonstração</strong>
          <span className="muted small">Senha de todas: 123456</span>
          <div className="chips">
            {CONTAS.map((c) => (
              <button type="button" key={c.login} className="chip" onClick={() => preencher(c.login)}>
                <b>{c.login}</b> {c.papel}
              </button>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
