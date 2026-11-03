import { useCallback, useEffect, useMemo, useState } from 'react'
import { api } from '../api'
import { Alert, Confirm, Empty, Field, Loading, Modal, StatusBadge } from '../components/ui'
import { PROPRIETARIO, STATUS, descreverAutomovel, diarias, formatData, formatDataHora, formatMoeda, hoje } from '../util'

function PedidoForm({ pedido, automoveis, onSalvar, onClose }) {
  const [automovelId, setAutomovelId] = useState(pedido?.automovel?.id ? String(pedido.automovel.id) : '')
  const [dataInicio, setDataInicio] = useState(pedido?.dataInicio || '')
  const [dataFim, setDataFim] = useState(pedido?.dataFim || '')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const dias = diarias(dataInicio, dataFim)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    if (dataFim < dataInicio) {
      setErro('A data final deve ser igual ou posterior à data inicial.')
      return
    }
    setEnviando(true)
    try {
      await onSalvar({ automovelId: Number(automovelId), dataInicio, dataFim })
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  return (
    <Modal titulo={pedido ? `Modificar pedido #${pedido.id}` : 'Novo pedido de aluguel'} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit}>
        <Alert onClose={() => setErro('')}>{erro}</Alert>
        {automoveis.length === 0 ? (
          <Empty titulo="Nenhum automóvel disponível">Peça a um agente para cadastrar automóveis.</Empty>
        ) : (
          <Field label="Automóvel">
            <select value={automovelId} onChange={(e) => setAutomovelId(e.target.value)} required>
              <option value="" disabled>
                Selecione um automóvel
              </option>
              {automoveis.map((a) => (
                <option key={a.id} value={a.id}>
                  {descreverAutomovel(a)} · placa {a.placa}
                </option>
              ))}
            </select>
          </Field>
        )}
        <div className="grid-2">
          <Field label="Data de início">
            <input
              type="date"
              value={dataInicio}
              min={pedido ? undefined : hoje()}
              onChange={(e) => setDataInicio(e.target.value)}
              required
            />
          </Field>
          <Field label="Data de término">
            <input
              type="date"
              value={dataFim}
              min={dataInicio || (pedido ? undefined : hoje())}
              onChange={(e) => setDataFim(e.target.value)}
              required
            />
          </Field>
        </div>
        {dias > 0 && (
          <p className="muted small">
            Período de {dias} {dias === 1 ? 'dia' : 'dias'}.
          </p>
        )}
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={enviando}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={enviando || automoveis.length === 0}>
            {enviando ? 'Salvando...' : pedido ? 'Salvar alterações' : 'Enviar pedido'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function AvaliarForm({ pedido, onSalvar, onClose }) {
  const [parecer, setParecer] = useState('')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(null)

  const avaliar = async (aprovado) => {
    setErro('')
    if (!aprovado && !parecer.trim()) {
      setErro('Informe um parecer para justificar a reprovação.')
      return
    }
    setEnviando(aprovado ? 'aprovar' : 'reprovar')
    try {
      await onSalvar({ aprovado, parecer: parecer.trim() })
    } catch (err) {
      setErro(err.message)
      setEnviando(null)
    }
  }

  return (
    <Modal titulo={`Avaliar pedido #${pedido.id}`} onClose={onClose}>
      <div className="form">
        <Alert onClose={() => setErro('')}>{erro}</Alert>
        <ResumoPedido pedido={pedido} />
        <ResumoCliente cliente={pedido.cliente} />
        <Field label="Parecer financeiro">
          <textarea
            rows={4}
            value={parecer}
            onChange={(e) => setParecer(e.target.value)}
            placeholder="Análise da renda, histórico e capacidade de pagamento do cliente"
          />
        </Field>
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={!!enviando}>
            Cancelar
          </button>
          <button type="button" className="btn btn-danger" onClick={() => avaliar(false)} disabled={!!enviando}>
            {enviando === 'reprovar' ? 'Reprovando...' : 'Reprovar'}
          </button>
          <button type="button" className="btn btn-success" onClick={() => avaliar(true)} disabled={!!enviando}>
            {enviando === 'aprovar' ? 'Aprovando...' : 'Aprovar'}
          </button>
        </div>
      </div>
    </Modal>
  )
}

function ContratoForm({ pedido, usuario, onSalvar, onClose }) {
  const banco = usuario.tipo === 'BANCO'
  const [tipoProprietario, setTipoProprietario] = useState(banco ? 'BANCO' : 'EMPRESA')
  const [valor, setValor] = useState('')
  const [credito, setCredito] = useState(false)
  const [valorCredito, setValorCredito] = useState('')
  const [taxaJuros, setTaxaJuros] = useState('')
  const [parcelas, setParcelas] = useState('12')
  const [erro, setErro] = useState('')
  const [enviando, setEnviando] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setErro('')
    const corpo = { tipoProprietario, valor: Number(valor), credito: banco && credito }
    if (corpo.credito) {
      corpo.valorCredito = valorCredito === '' ? Number(valor) : Number(valorCredito)
      corpo.taxaJuros = taxaJuros === '' ? null : Number(taxaJuros)
      corpo.parcelas = parcelas === '' ? null : Number(parcelas)
    }
    setEnviando(true)
    try {
      await onSalvar(corpo)
    } catch (err) {
      setErro(err.message)
      setEnviando(false)
    }
  }

  return (
    <Modal titulo={`Gerar contrato do pedido #${pedido.id}`} onClose={onClose}>
      <form className="form" onSubmit={handleSubmit}>
        <Alert onClose={() => setErro('')}>{erro}</Alert>
        <ResumoPedido pedido={pedido} />
        <div className="grid-2">
          <Field label="Proprietário do automóvel" hint="Define em nome de quem o carro será registrado.">
            <select value={tipoProprietario} onChange={(e) => setTipoProprietario(e.target.value)}>
              {Object.entries(PROPRIETARIO).map(([k, v]) => (
                <option key={k} value={k}>
                  {v}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Valor do contrato (R$)">
            <input type="number" min="0.01" step="0.01" value={valor} onChange={(e) => setValor(e.target.value)} required />
          </Field>
        </div>
        {banco ? (
          <label className="checkbox">
            <input type="checkbox" checked={credito} onChange={(e) => setCredito(e.target.checked)} />
            <span>Conceder contrato de crédito</span>
          </label>
        ) : (
          <p className="muted small">Contratos de crédito só podem ser concedidos por agentes do tipo banco.</p>
        )}
        {banco && credito && (
          <div className="grid-3 sub-panel">
            <Field label="Valor financiado (R$)" hint="Vazio usa o valor do contrato.">
              <input type="number" min="0.01" step="0.01" value={valorCredito} onChange={(e) => setValorCredito(e.target.value)} />
            </Field>
            <Field label="Juros (% a.m.)">
              <input type="number" min="0" step="0.01" value={taxaJuros} onChange={(e) => setTaxaJuros(e.target.value)} required />
            </Field>
            <Field label="Parcelas">
              <input type="number" min="1" step="1" value={parcelas} onChange={(e) => setParcelas(e.target.value)} required />
            </Field>
          </div>
        )}
        <div className="form-actions">
          <button type="button" className="btn btn-ghost" onClick={onClose} disabled={enviando}>
            Cancelar
          </button>
          <button type="submit" className="btn btn-primary" disabled={enviando}>
            {enviando ? 'Gerando...' : 'Executar contrato'}
          </button>
        </div>
      </form>
    </Modal>
  )
}

function valorParcela(credito) {
  const n = Number(credito?.parcelas)
  const v = Number(credito?.valor)
  if (!n || !v) return null
  const i = Number(credito.taxaJuros || 0) / 100
  if (i === 0) return v / n
  return (v * i) / (1 - Math.pow(1 + i, -n))
}

function ContratoView({ pedido, onClose }) {
  const [contrato, setContrato] = useState(null)
  const [erro, setErro] = useState('')

  useEffect(() => {
    let ativo = true
    api
      .get(`/api/pedidos/${pedido.id}/contrato`)
      .then((c) => ativo && setContrato(c))
      .catch((err) => ativo && setErro(err.message))
    return () => {
      ativo = false
    }
  }, [pedido.id])

  const cc = contrato?.contratoCredito
  const parcela = valorParcela(cc)

  return (
    <Modal titulo={`Contrato do pedido #${pedido.id}`} onClose={onClose}>
      <Alert>{erro}</Alert>
      {!contrato && !erro && <Loading />}
      {contrato && (
        <div className="stack">
          <ResumoPedido pedido={pedido} />
          <dl className="dl">
            <dt>Contrato</dt>
            <dd>#{contrato.id}</dd>
            <dt>Assinatura</dt>
            <dd>{formatData(contrato.dataAssinatura)}</dd>
            <dt>Valor</dt>
            <dd>{formatMoeda(contrato.valor)}</dd>
            <dt>Propriedade</dt>
            <dd>Automóvel registrado em nome do(a) {PROPRIETARIO[contrato.tipoProprietario]?.toLowerCase()}</dd>
          </dl>
          {cc ? (
            <div className="sub-panel">
              <h3>Contrato de crédito</h3>
              <dl className="dl">
                <dt>Banco</dt>
                <dd>{cc.banco?.nome || '-'}</dd>
                <dt>Valor financiado</dt>
                <dd>{formatMoeda(cc.valor)}</dd>
                <dt>Juros</dt>
                <dd>{cc.taxaJuros != null ? `${Number(cc.taxaJuros).toLocaleString('pt-BR')}% a.m.` : '-'}</dd>
                <dt>Parcelas</dt>
                <dd>
                  {cc.parcelas || '-'}
                  {parcela ? ` de ${formatMoeda(parcela)}` : ''}
                </dd>
              </dl>
            </div>
          ) : (
            <p className="muted small">Sem contrato de crédito associado.</p>
          )}
        </div>
      )}
    </Modal>
  )
}

function ResumoPedido({ pedido }) {
  const dias = diarias(pedido.dataInicio, pedido.dataFim)
  return (
    <div className="resumo">
      <div>
        <span className="muted small">Automóvel</span>
        <strong>{descreverAutomovel(pedido.automovel)}</strong>
        {pedido.automovel?.placa && (
          <span className="placa placa-sm" aria-label={`Placa ${pedido.automovel.placa}`}>
            {pedido.automovel.placa}
          </span>
        )}
      </div>
      <div>
        <span className="muted small">Período</span>
        <strong>
          {formatData(pedido.dataInicio)} <span className="nowrap">→ {formatData(pedido.dataFim)}</span>
        </strong>
        <span className="muted small">
          {dias} {dias === 1 ? 'diária' : 'diárias'}
        </span>
      </div>
    </div>
  )
}

function ResumoCliente({ cliente }) {
  if (!cliente) return null
  const renda = (cliente.rendimentos || []).reduce((s, r) => s + Number(r.valor || 0), 0)
  return (
    <div className="sub-panel">
      <h3>{cliente.nome}</h3>
      <p className="muted small">
        CPF {cliente.cpf} · {cliente.profissao}
      </p>
      {(cliente.rendimentos || []).length > 0 ? (
        <ul className="lista-simples">
          {cliente.rendimentos.map((r) => (
            <li key={r.id ?? r.entidadeEmpregadora}>
              <span>{r.entidadeEmpregadora}</span>
              <span>{formatMoeda(r.valor)}</span>
            </li>
          ))}
          <li className="total">
            <span>Renda total</span>
            <span>{formatMoeda(renda)}</span>
          </li>
        </ul>
      ) : (
        <p className="muted small">Cliente sem rendimentos informados.</p>
      )}
    </div>
  )
}

export default function Pedidos({ usuario }) {
  const agente = usuario.perfil === 'AGENTE'
  const [pedidos, setPedidos] = useState(null)
  const [automoveis, setAutomoveis] = useState([])
  const [erro, setErro] = useState('')
  const [sucesso, setSucesso] = useState('')
  const [filtro, setFiltro] = useState('TODOS')
  const [busca, setBusca] = useState('')
  const [acao, setAcao] = useState(null)

  const carregar = useCallback(async () => {
    setErro('')
    try {
      const [p, a] = await Promise.all([api.get('/api/pedidos'), api.get('/api/automoveis')])
      setPedidos(p || [])
      setAutomoveis(a || [])
    } catch (err) {
      setErro(err.message)
      setPedidos((atual) => atual || [])
    }
  }, [])

  useEffect(() => {
    carregar()
  }, [carregar])

  const contagem = useMemo(() => {
    const c = { TODOS: pedidos?.length || 0 }
    Object.keys(STATUS).forEach((s) => {
      c[s] = (pedidos || []).filter((p) => p.status === s).length
    })
    return c
  }, [pedidos])

  const visiveis = useMemo(() => {
    const termo = busca.trim().toLowerCase()
    return (pedidos || []).filter((p) => {
      if (filtro !== 'TODOS' && p.status !== filtro) return false
      if (!termo) return true
      const alvo = [p.id, p.cliente?.nome, p.cliente?.cpf, p.automovel?.marca, p.automovel?.modelo, p.automovel?.placa]
        .join(' ')
        .toLowerCase()
      return alvo.includes(termo)
    })
  }, [pedidos, filtro, busca])

  const fechar = useCallback(() => setAcao(null), [])

  const concluir = async (mensagem) => {
    setAcao(null)
    setSucesso(mensagem)
    await carregar()
  }

  const podeModificar = (p) => (agente ? ['PENDENTE', 'APROVADO'].includes(p.status) : p.status === 'PENDENTE')
  const podeCancelar = (p) => !agente && ['PENDENTE', 'APROVADO'].includes(p.status)

  return (
    <div className="page">
      <div className="page-header">
        <div>
          <span className="eyebrow">
            {agente ? `Mesa de avaliação · ${usuario.tipo === 'BANCO' ? 'Banco' : 'Empresa'}` : 'Área do cliente'}
          </span>
          <h1>{agente ? 'Pedidos de aluguel' : 'Meus pedidos'}</h1>
          <p className="muted">
            {agente
              ? 'Avalie, modifique e execute os contratos dos pedidos dos clientes.'
              : 'Acompanhe o status dos seus pedidos de aluguel.'}
          </p>
        </div>
        {!agente && (
          <button type="button" className="btn btn-primary" onClick={() => setAcao({ tipo: 'novo' })}>
            + Novo pedido
          </button>
        )}
      </div>

      <Alert onClose={() => setErro('')}>{erro}</Alert>
      <Alert tipo="sucesso" onClose={() => setSucesso('')}>
        {sucesso}
      </Alert>

      <div className="toolbar">
        <div className="tabs" role="tablist">
          {['TODOS', ...Object.keys(STATUS)].map((s) => (
            <button
              type="button"
              key={s}
              role="tab"
              aria-selected={filtro === s}
              className={`tab${filtro === s ? ' active' : ''}`}
              onClick={() => setFiltro(s)}
            >
              {s === 'TODOS' ? 'Todos' : STATUS[s]}
              <span className="tab-count">{contagem[s]}</span>
            </button>
          ))}
        </div>
        {agente && (
          <input
            className="search"
            type="search"
            placeholder="Buscar por cliente, CPF, carro ou placa"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        )}
      </div>

      {pedidos === null ? (
        <Loading texto="Carregando pedidos..." />
      ) : visiveis.length === 0 ? (
        <Empty titulo={pedidos.length === 0 ? 'Nenhum pedido ainda' : 'Nenhum pedido neste filtro'}>
          {pedidos.length === 0 && !agente
            ? 'Clique em "Novo pedido" para solicitar o aluguel de um automóvel.'
            : 'Altere o filtro para ver outros pedidos.'}
        </Empty>
      ) : (
        <div className="cards">
          {visiveis.map((p) => (
            <article className={`card pedido status-${p.status.toLowerCase()}`} key={p.id}>
              <header className="pedido-header">
                <span className="pedido-id">
                  <span>Pedido</span>Nº {String(p.id).padStart(4, '0')}
                </span>
                <StatusBadge status={p.status} />
              </header>
              <ResumoPedido pedido={p} />
              {agente && p.cliente && (
                <p className="pedido-cliente">
                  <span className="muted small">Cliente</span> {p.cliente.nome}
                  <span className="muted small"> · CPF {p.cliente.cpf}</span>
                </p>
              )}
              {(p.parecer || p.agenteAvaliador) && (
                <div className="parecer">
                  {p.agenteAvaliador && (
                    <span className="muted small">
                      Avaliado por {p.agenteAvaliador.nome}
                      {p.agenteAvaliador.tipo ? ` (${p.agenteAvaliador.tipo === 'BANCO' ? 'banco' : 'empresa'})` : ''}
                    </span>
                  )}
                  {p.parecer && <p>{p.parecer}</p>}
                </div>
              )}
              <footer className="pedido-footer">
                <span className="muted small">Criado em {formatDataHora(p.dataCriacao)}</span>
                <div className="actions">
                  {agente && p.status === 'PENDENTE' && (
                    <button type="button" className="btn btn-primary btn-sm" onClick={() => setAcao({ tipo: 'avaliar', pedido: p })}>
                      Avaliar
                    </button>
                  )}
                  {agente && p.status === 'APROVADO' && (
                    <button type="button" className="btn btn-success btn-sm" onClick={() => setAcao({ tipo: 'contratar', pedido: p })}>
                      Gerar contrato
                    </button>
                  )}
                  {p.status === 'CONTRATADO' && (
                    <button type="button" className="btn btn-secondary btn-sm" onClick={() => setAcao({ tipo: 'contrato', pedido: p })}>
                      Ver contrato
                    </button>
                  )}
                  {podeModificar(p) && (
                    <button type="button" className="btn btn-ghost btn-sm" onClick={() => setAcao({ tipo: 'editar', pedido: p })}>
                      Modificar
                    </button>
                  )}
                  {podeCancelar(p) && (
                    <button
                      type="button"
                      className="btn btn-ghost btn-danger-text btn-sm"
                      onClick={() => setAcao({ tipo: 'cancelar', pedido: p })}
                    >
                      Cancelar
                    </button>
                  )}
                </div>
              </footer>
            </article>
          ))}
        </div>
      )}

      {acao?.tipo === 'novo' && (
        <PedidoForm
          automoveis={automoveis}
          onClose={fechar}
          onSalvar={async (corpo) => {
            await api.post('/api/pedidos', corpo)
            await concluir('Pedido enviado. Aguarde a avaliação de um agente.')
          }}
        />
      )}
      {acao?.tipo === 'editar' && (
        <PedidoForm
          pedido={acao.pedido}
          automoveis={automoveis}
          onClose={fechar}
          onSalvar={async (corpo) => {
            await api.put(`/api/pedidos/${acao.pedido.id}`, corpo)
            await concluir(`Pedido #${acao.pedido.id} modificado.`)
          }}
        />
      )}
      {acao?.tipo === 'avaliar' && (
        <AvaliarForm
          pedido={acao.pedido}
          onClose={fechar}
          onSalvar={async (corpo) => {
            await api.patch(`/api/pedidos/${acao.pedido.id}/avaliar`, corpo)
            await concluir(`Pedido #${acao.pedido.id} ${corpo.aprovado ? 'aprovado' : 'reprovado'}.`)
          }}
        />
      )}
      {acao?.tipo === 'contratar' && (
        <ContratoForm
          pedido={acao.pedido}
          usuario={usuario}
          onClose={fechar}
          onSalvar={async (corpo) => {
            await api.post(`/api/pedidos/${acao.pedido.id}/contrato`, corpo)
            await concluir(`Contrato do pedido #${acao.pedido.id} executado.`)
          }}
        />
      )}
      {acao?.tipo === 'contrato' && <ContratoView pedido={acao.pedido} onClose={fechar} />}
      {acao?.tipo === 'cancelar' && (
        <Confirm
          titulo={`Cancelar pedido #${acao.pedido.id}`}
          mensagem="O pedido será cancelado e não poderá mais ser avaliado ou contratado. Deseja continuar?"
          confirmarLabel="Cancelar pedido"
          perigo
          onClose={fechar}
          onConfirm={async () => {
            await api.patch(`/api/pedidos/${acao.pedido.id}/cancelar`)
            await concluir(`Pedido #${acao.pedido.id} cancelado.`)
          }}
        />
      )}
    </div>
  )
}
