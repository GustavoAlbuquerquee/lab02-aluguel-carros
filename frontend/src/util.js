export const STATUS = {
  PENDENTE: 'Pendente',
  APROVADO: 'Aprovado',
  REPROVADO: 'Reprovado',
  CANCELADO: 'Cancelado',
  CONTRATADO: 'Contratado',
}

export const PROPRIETARIO = {
  CLIENTE: 'Cliente',
  EMPRESA: 'Empresa',
  BANCO: 'Banco',
}

const moeda = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

export function formatMoeda(valor) {
  if (valor === null || valor === undefined || valor === '') return '-'
  return moeda.format(Number(valor))
}

export function formatData(valor) {
  if (!valor) return '-'
  const [data] = String(valor).split('T')
  const [ano, mes, dia] = data.split('-')
  if (!ano || !mes || !dia) return valor
  return `${dia}/${mes}/${ano}`
}

export function formatDataHora(valor) {
  if (!valor) return '-'
  const [data, hora] = String(valor).split('T')
  return hora ? `${formatData(data)} ${hora.slice(0, 5)}` : formatData(data)
}

export function diarias(inicio, fim) {
  if (!inicio || !fim) return 0
  const diff = (new Date(fim) - new Date(inicio)) / 86400000
  return Number.isFinite(diff) && diff >= 0 ? diff + 1 : 0
}

export function hoje() {
  const d = new Date()
  const mes = String(d.getMonth() + 1).padStart(2, '0')
  const dia = String(d.getDate()).padStart(2, '0')
  return `${d.getFullYear()}-${mes}-${dia}`
}

export function descreverAutomovel(a) {
  if (!a) return '-'
  return `${a.marca} ${a.modelo} ${a.ano}`
}
