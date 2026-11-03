import { signup } from '../api'
import ClienteForm from '../components/ClienteForm'

export default function Cadastro({ onConcluido, onVoltar }) {
  const handleSubmit = async (dados) => {
    await signup(dados)
    onConcluido(dados.login)
  }

  return (
    <div className="page-narrow">
      <button type="button" className="link back-link" onClick={onVoltar}>
        ← Voltar para o login
      </button>
      <div className="card card-cadastro">
        <div className="card-header">
          <div>
            <span className="eyebrow">Novo cliente</span>
            <h1>Criar sua conta</h1>
            <p className="muted">Informe seus dados pessoais e até três rendimentos.</p>
          </div>
        </div>
        <ClienteForm submitLabel="Criar conta" onSubmit={handleSubmit} onCancel={onVoltar} />
      </div>
    </div>
  )
}
