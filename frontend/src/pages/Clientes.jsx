import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import ClienteForm from '../components/ClienteForm'
import { Alert, Confirm, Empty, Loading, Modal } from '../components/ui'
import { formatMoeda } from '../util'

function rendaTotal(cliente) {
  return (cliente.rendimentos || []).reduce((s, r) => s + Number(r.valor || 0), 0)
}

export function ClienteDetalhes({ cliente }) {
  return (
    <div className="stack">
      <dl className="dl">
        <dt>Nome</dt>
        <dd>{cliente.nome}</dd>
        <dt>Usuário</dt>
        <dd>{cliente.login}</dd>
        <dt>CPF</dt>
        <dd>{cliente.cpf}</dd>
        <dt>RG</dt>
        <dd>{cliente.rg}</dd>
        <dt>Endereço</dt>
        <dd>{cliente.endereco}</dd>
        <dt>Profissão</dt>
        <dd>{cliente.profissao}</dd>
      </dl>
      <div className="sub-panel">
        <h3>Rendimentos</h3>
        {(cliente.rendimentos || []).length === 0 ? (
          <p className="muted small">Nenhum rendimento informado.</p>
        ) : (
          <ul className="lista-simples">
            {cliente.rendimentos.map((r) => (
              <li key={r.id ?? r.entidadeEmpregadora}>
                <span>{r.entidadeEmpregadora}</span>
                <span>{formatMoeda(r.valor)}</span>
              </li>
            ))}
            <li className="total">
              <span>Renda total</span>
              <span>{formatMoeda(rendaTotal(cliente))}</span>
            </li>
          </ul>
        )}
      </div>
    </div>
  )
}

export default function Clientes() {
  const [clientes, setClientes] = useState(null)
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [busca, setBusca] = useState('')
  const [acao, setAcao] = useState(null)

  const carregar = useCallback(async () => {
    setErro('')
    try {
      setClientes((await api.get('/api/clientes')) || [])
    } catch (err) {
      setErro(err.message)
      setClientes((atual) => atual || [])
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    if (!termo) return clientes || []
    return (clientes || []).filter((c) =>
      [c.nome, c.cpf, c.login, c.profissao].join(' ').toLowerCase().includes(termo),
    )
  }, [clientes, busca])

  const fechar = useCallback(() => setAcao(null), [])

  const concluir = async (mensagem) => {
    setAcao(null)
    setSucesso(mensagem)
    await carregar()
  }

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            Cadastro{clientes ? ` · ${clientes.length} ${clientes.length === 1 ? 'cliente' : 'clientes'}` : ''}
          </span>
          <h1>Clientes</h1>
          <p className="muted">Consulte, modifique e remova cadastros de clientes.</p>
        </div>
        <button type="button" className="btn btn-primary" onClick={() => setAcao({ tipo: 'novo' })}>
          + Novo cliente
        </button>
      </div>

      <Alert onClose={() => setErro('')}>{erro}</Alert>
      <Alert tipo="sucesso" onClose={() => setSucesso('')}>
        {sucesso}
      </Alert>

      <div className="toolbar">
        <input
          className="search"
          type="search"
          placeholder="Buscar por nome, CPF, usuário ou profissão"
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
        />
      </div>

      {clientes === null ? (
        <Loading texto="Carregando clientes..." />
      ) : visiveis.length === 0 ? (
        <Empty titulo={clientes.length === 0 ? 'Nenhum cliente cadastrado' : 'Nenhum cliente encontrado'} />
      ) : (
        <div className="table-wrap card">
          <table className="table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>CPF</th>
                <th>Profissão</th>
                <th>Renda total</th>
                <th className="col-actions">Ações</th>
              </tr>
            </thead>
            <tbody>
              {visiveis.map((c) => (
                <tr key={c.id}>
                  <td data-label="Nome">
                    <div>
                      <strong>{c.nome}</strong>
                      <span className="muted small block">@{c.login}</span>
                    </div>
                  </td>
                  <td data-label="CPF" className="mono">{c.cpf}</td>
                  <td data-label="Profissão">{c.profissao}</td>
                  <td data-label="Renda total" className="mono">{formatMoeda(rendaTotal(c))}</td>
                  <td className="col-actions">
                    <div className="actions">
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAcao({ tipo: 'ver', cliente: c })}>
                        Ver
                      </button>
                      <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAcao({ tipo: 'editar', cliente: c })}>
                        Editar
                      </button>
                      <button
                        type="button"
                        className="btn btn-ghost btn-danger-text btn-sm"
                        onClick={() => setAcao({ tipo: 'excluir', cliente: c })}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {acao?.tipo === 'ver' && (
        <Modal titulo={acao.cliente.nome} onClose={fechar}>
          <ClienteDetalhes cliente={acao.cliente} />
        </Modal>
      )}
      {acao?.tipo === 'novo' && (
        <Modal titulo="Novo cliente" onClose={fechar} largo>
          <ClienteForm
            submitLabel="Cadastrar"
            onCancel={fechar}
            onSubmit={async (dados) => {
              await api.post('/api/clientes', dados)
              await concluir(`Cliente ${dados.nome} cadastrado.`)
            }}
          />
        </Modal>
      )}
      {acao?.tipo === 'editar' && (
        <Modal titulo={`Editar ${acao.cliente.nome}`} onClose={fechar} largo>
          <ClienteForm
            cliente={acao.cliente}
            edicao
            submitLabel="Salvar alterações"
            onCancel={fechar}
            onSubmit={async (dados) => {
              await api.put(`/api/clientes/${acao.cliente.id}`, dados)
              await concluir(`Cliente ${dados.nome} atualizado.`)
            }}
          />
        </Modal>
      )}
      {acao?.tipo === 'excluir' && (
        <Confirm
          titulo="Excluir cliente"
          mensagem={`Deseja excluir o cadastro de ${acao.cliente.nome}? Clientes com pedidos não podem ser excluídos.`}
          confirmarLabel="Excluir"
          perigo
          onClose={fechar}
          onConfirm={async () => {
            await api.del(`/api/clientes/${acao.cliente.id}`)
            await concluir(`Cliente ${acao.cliente.nome} excluído.`)
          }}
        />
      )}
    </div>
  )
}
