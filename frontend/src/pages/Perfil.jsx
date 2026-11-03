import { useState } from 'react'
import { api, me, updateCredentials } from '../api'
import ClienteForm from '../components/ClienteForm'
import { Alert, Confirm } from '../components/ui'

export default function Perfil({ usuario, onAtualizado, onExcluido }) {
  const [sucesso, setSucesso] = useState('')
  const [excluindo, setExcluindo] = useState(false)
  const [versao, setVersao] = useState(0)

  const salvar = async (dados) => {
    setSucesso('')
    await api.put(`/api/clientes/${usuario.id}`, dados)
    updateCredentials({ login: dados.login, senha: dados.senha })
    const atualizado = await me()
    onAtualizado(atualizado)
    setVersao((v) => v + 1)
    setSucesso('Perfil atualizado com sucesso.')
  }

  return (
    <div className="page page-narrow">
      <div className="page-header">
        <div>
          <span className="eyebrow">Conta · @{usuario.login}</span>
          <h1>Meu perfil</h1>
          <p className="muted">Mantenha seus dados pessoais e rendimentos atualizados.</p>
        </div>
      </div>

      <Alert tipo="sucesso" onClose={() => setSucesso('')}>
        {sucesso}
      </Alert>

      <div className="card">
        <ClienteForm key={versao} cliente={usuario} edicao submitLabel="Salvar alterações" onSubmit={salvar} />
      </div>

      <div className="card danger-zone">
        <div>
          <h2>Excluir conta</h2>
          <p className="muted">
            Remove permanentemente seu cadastro. Só é possível se você não tiver pedidos registrados.
          </p>
        </div>
        <button type="button" className="btn btn-danger" onClick={() => setExcluindo(true)}>
          Excluir minha conta
        </button>
      </div>

      {excluindo && (
        <Confirm
          titulo="Excluir conta"
          mensagem="Tem certeza de que deseja excluir sua conta? Esta ação não pode ser desfeita."
          confirmarLabel="Excluir conta"
          perigo
          onClose={() => setExcluindo(false)}
          onConfirm={async () => {
            await api.del(`/api/clientes/${usuario.id}`)
            onExcluido()
          }}
        />
      )}
    </div>
  )
}
