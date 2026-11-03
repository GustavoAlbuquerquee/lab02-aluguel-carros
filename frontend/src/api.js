const BASE_URL = (import.meta.env.VITE_API_URL || 'http://localhost:8080').replace(/\/$/, '')
const STORAGE_KEY = 'aluguel.auth'

function encode(login, senha) {
  const bytes = new TextEncoder().encode(`${login}:${senha}`)
  let binary = ''
  bytes.forEach((b) => {
    binary += String.fromCharCode(b)
  })
  return btoa(binary)
}

export function getToken() {
  try {
    return sessionStorage.getItem(STORAGE_KEY)
  } catch {
    return null
  }
}

export function setCredentials(login, senha) {
  const token = encode(login, senha)
  try {
    sessionStorage.setItem(STORAGE_KEY, token)
  } catch {
    return token
  }
  return token
}

export function updateCredentials({ login: novoLogin, senha: novaSenha }) {
  const token = getToken()
  if (!token) return
  const bytes = Uint8Array.from(atob(token), (c) => c.charCodeAt(0))
  const atual = new TextDecoder().decode(bytes)
  const sep = atual.indexOf(':')
  const loginAtual = atual.slice(0, sep)
  const senhaAtual = atual.slice(sep + 1)
  setCredentials(novoLogin || loginAtual, novaSenha || senhaAtual)
}

export function clearCredentials() {
  try {
    sessionStorage.removeItem(STORAGE_KEY)
  } catch {
    return
  }
}

export const SESSAO_EXPIRADA = 'aluguel:sessao-expirada'

async function request(method, path, body, tokenExplicito) {
  const sessao = tokenExplicito === undefined
  const token = sessao ? getToken() : tokenExplicito
  const headers = { Accept: 'application/json' }
  if (body !== undefined) headers['Content-Type'] = 'application/json'
  if (token) headers.Authorization = `Basic ${token}`

  let response
  try {
    response = await fetch(`${BASE_URL}${path}`, {
      method,
      headers,
      body: body !== undefined ? JSON.stringify(body) : undefined,
    })
  } catch {
    throw new Error('Não foi possível conectar ao servidor. Verifique se o backend está em execução.')
  }

  const text = await response.text()
  let data = null
  if (text) {
    try {
      data = JSON.parse(text)
    } catch {
      data = text
    }
  }

  if (!response.ok) {
    if (response.status === 401 && sessao && token) {
      clearCredentials()
      window.dispatchEvent(new Event(SESSAO_EXPIRADA))
    }
    let message = data && typeof data === 'object' ? data.message || data.error : null
    if (!message) {
      if (response.status === 401) message = 'Usuário ou senha inválidos.'
      else if (response.status === 403) message = 'Você não tem permissão para esta ação.'
      else if (response.status === 404) message = 'Registro não encontrado.'
      else message = `Erro ${response.status} ao processar a requisição.`
    }
    const error = new Error(message)
    error.status = response.status
    throw error
  }

  return data
}

export const api = {
  get: (path) => request('GET', path),
  post: (path, body) => request('POST', path, body ?? {}),
  put: (path, body) => request('PUT', path, body ?? {}),
  patch: (path, body) => request('PATCH', path, body),
  del: (path) => request('DELETE', path),
}

export async function login(usuario, senha) {
  const token = encode(usuario, senha)
  const user = await request('GET', '/api/auth/me', undefined, token)
  setCredentials(usuario, senha)
  return user
}

export function me() {
  return request('GET', '/api/auth/me')
}

export function signup(dados) {
  return request('POST', '/api/clientes', dados, null)
}
