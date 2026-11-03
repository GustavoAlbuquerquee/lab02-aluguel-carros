import { useEffect, useState } from 'react'
import { SESSAO_EXPIRADA, clearCredentials, getToken, me } from './api'
import { Loading } from './components/ui'
import Automoveis from './pages/Automoveis'
import Cadastro from './pages/Cadastro'
import Clientes from './pages/Clientes'
import Login from './pages/Login'
import Pedidos from './pages/Pedidos'
import Perfil from './pages/Perfil'

const MENUS = {
  CLIENTE: [
    { id: 'pedidos', label: 'Meus pedidos' },
    { id: 'automoveis', label: 'Automóveis' },
    { id: 'perfil', label: 'Meu perfil' },
  ],
  AGENTE: [
    { id: 'pedidos', label: 'Pedidos' },
    { id: 'clientes', label: 'Clientes' },
    { id: 'automoveis', label: 'Automóveis' },
  ],
}

function papel(usuario) {
  if (usuario.perfil === 'CLIENTE') return 'Cliente'
  return usuario.tipo === 'BANCO' ? 'Agente · Banco' : 'Agente · Empresa'
}

function iniciais(nome) {
  return (nome || '?')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0].toUpperCase())
    .join('')
}

export default function App() {
  const [usuario, setUsuario] = useState(() => (getToken() ? undefined : null))
  const [tela, setTela] = useState('login')
  const [aviso, setAviso] = useState('')
  const [pagina, setPagina] = useState('pedidos')

  useEffect(() => {
    if (usuario !== undefined) return
    me()
      .then(setUsuario)
      .catch(() => {
        clearCredentials()
        setUsuario(null)
      })
  }, [usuario])

  useEffect(() => {
    const expirar = () => {
      setUsuario(null)
      setTela('login')
      setAviso('Sua sessão expirou ou suas credenciais mudaram. Entre novamente.')
    }
    window.addEventListener(SESSAO_EXPIRADA, expirar)
    return () => window.removeEventListener(SESSAO_EXPIRADA, expirar)
  }, [])

  const entrar = (user) => {
    setAviso('')
    setPagina('pedidos')
    setUsuario(user)
  }

  const sair = (mensagem = '') => {
    clearCredentials()
    setUsuario(null)
    setTela('login')
    setAviso(mensagem)
  }

  if (usuario === undefined) {
    return (
      <div className="center-screen">
        <Loading texto="Verificando sessão..." />
      </div>
    )
  }

  if (!usuario) {
    return (
      <main className="public">
        {tela === 'cadastro' ? (
          <Cadastro
            onVoltar={() => setTela('login')}
            onConcluido={(login) => {
              setAviso(`Conta "${login}" criada com sucesso. Faça login para continuar.`)
              setTela('login')
            }}
          />
        ) : (
          <Login
            aviso={aviso}
            onLogin={entrar}
            onCadastro={() => {
              setAviso('')
              setTela('cadastro')
            }}
          />
        )}
      </main>
    )
  }

  const menu = MENUS[usuario.perfil] || MENUS.CLIENTE
  const atual = menu.some((m) => m.id === pagina) ? pagina : 'pedidos'

  return (
    <div className="app">
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <span className="brand-mark" aria-hidden="true">AC</span>
            <span className="brand-name">
              Aluguel de Carros
              <small>Gestão de frota e contratos</small>
            </span>
          </div>
          <nav className="nav" aria-label="Navegação principal">
            {menu.map((m) => (
              <button
                type="button"
                key={m.id}
                className={`nav-item${atual === m.id ? ' active' : ''}`}
                aria-current={atual === m.id ? 'page' : undefined}
                onClick={() => setPagina(m.id)}
              >
                {m.label}
              </button>
            ))}
          </nav>
          <div className="user">
            <span className="avatar" aria-hidden="true">{iniciais(usuario.nome)}</span>
            <div className="user-info">
              <strong>{usuario.nome}</strong>
              <span>{papel(usuario)}</span>
            </div>
            <button type="button" className="btn btn-on-dark btn-sm" onClick={() => sair()}>
              Sair
            </button>
          </div>
        </div>
      </header>

      <main className="content">
        {atual === 'pedidos' && <Pedidos key={usuario.id} usuario={usuario} />}
        {atual === 'clientes' && <Clientes />}
        {atual === 'automoveis' && <Automoveis usuario={usuario} />}
        {atual === 'perfil' && (
          <Perfil usuario={usuario} onAtualizado={setUsuario} onExcluido={() => sair('Sua conta foi excluída.')} />
        )}
      </main>

      <footer className="footer">
        <span>LAB02 · Sistema de Aluguel de Carros</span>
        <span>DIAW · PUC Minas</span>
      </footer>
    </div>
  )
}
