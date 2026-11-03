# Frontend - Aluguel de Carros

Interface web em React + Vite do sistema de aluguel de carros (LAB02).

## Execução

```bash
cp .env.example .env
npm install
npm run dev
```

A aplicação abre em `http://localhost:5173` e consome a API definida em `VITE_API_URL` (padrão `http://localhost:8080`).

## Scripts

| Comando | Descrição |
| --- | --- |
| `npm run dev` | Servidor de desenvolvimento |
| `npm run build` | Build de produção em `dist/` |
| `npm run preview` | Serve o build de produção |
| `npm run lint` | Verificação com ESLint |

## Estrutura

```
src/
  api.js                 cliente HTTP (fetch + autenticação Basic)
  util.js                formatação e rótulos
  App.jsx                sessão e navegação por perfil
  components/
    ui.jsx               modal, alertas, badges, estados de carregamento
    ClienteForm.jsx      formulário de cliente com até 3 rendimentos
  pages/
    Login.jsx            autenticação
    Cadastro.jsx         cadastro público de cliente
    Pedidos.jsx          pedidos, avaliação e contratos
    Clientes.jsx         CRUD de clientes (agentes)
    Automoveis.jsx       frota de automóveis
    Perfil.jsx           edição e exclusão do próprio cadastro
```

## Contas de demonstração

| Usuário | Senha | Perfil |
| --- | --- | --- |
| cliente | 123456 | Cliente |
| empresa | 123456 | Agente (empresa) |
| banco | 123456 | Agente (banco) |
