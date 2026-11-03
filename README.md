---

# 🚗 Sistema de Aluguel de Carros 👨‍💻

> [!NOTE]
> Sistema web para **gestão de aluguéis de automóveis**: clientes introduzem, modificam, consultam e cancelam pedidos de aluguel, enquanto agentes (empresas e bancos) avaliam os pedidos e executam os contratos, com possibilidade de **contrato de crédito** concedido por um banco.  
> Trabalho do **LAB02** da disciplina **Desenvolvimento e Integração de Aplicações Web (DIAW)** — Engenharia de Software, PUC Minas.

<table>
  <tr>
    <td width="800px">
      <div align="justify">
        Este <b>README.md</b> documenta o <b>Sistema de Aluguel de Carros</b>, desenvolvido no LAB02 da disciplina <i>Desenvolvimento e Integração de Aplicações Web</i>, sob orientação do <a href="https://github.com/joaopauloaramuni">Prof. Dr. João Paulo Carneiro Aramuni</a>. O sistema apoia a gestão de aluguéis de automóveis, permitindo efetuar, cancelar e modificar pedidos pela Internet. Os <b>clientes</b> (pessoas físicas) cadastram-se informando seus dados pessoais e até três rendimentos, e introduzem pedidos de aluguel; os <b>agentes</b> (empresas e bancos) analisam os pedidos do ponto de vista financeiro e, em caso de parecer positivo, executam o contrato. O projeto segue a arquitetura <i>MVC</i>, com <b>back-end em Spring Boot</b>, <b>front-end em React + Vite</b> e banco de dados <b>PostgreSQL no Supabase</b>, e está documentado com <i>diagrama de casos de uso</i>, <i>histórias de usuário</i>, <i>diagrama de classes</i> e <i>diagrama de pacotes</i>.
      </div>
    </td>
    <td>
      <div>
        <img src="https://joaopauloaramuni.github.io/image/logo_ES_vertical.png" alt="Logo Engenharia de Software PUC Minas" width="120px"/>
      </div>
    </td>
  </tr> 
</table>

---

## 🚧 Status do Projeto

[![Versão](https://img.shields.io/badge/Versão-v1.0.0-blue)](https://github.com/GustavoAlbuquerquee/lab02-aluguel-carros)
[![Licença](https://img.shields.io/badge/Licença-MIT-blue)](#-licença)
![Status](https://img.shields.io/badge/Status-Protótipo_funcional-brightgreen)

![Java](https://img.shields.io/badge/Java-25-007ec6?style=for-the-badge&logo=openjdk&logoColor=white) ![Spring Boot](https://img.shields.io/badge/Spring_Boot-4.0.0-007ec6?style=for-the-badge&logo=springboot&logoColor=white) ![Maven](https://img.shields.io/badge/Maven-Wrapper-007ec6?style=for-the-badge&logo=apachemaven&logoColor=white) ![React](https://img.shields.io/badge/React-19-007ec6?style=for-the-badge&logo=react&logoColor=white) ![Vite](https://img.shields.io/badge/Vite-6-007ec6?style=for-the-badge&logo=vite&logoColor=white) ![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-007ec6?style=for-the-badge&logo=supabase&logoColor=white) ![GitHub repo size](https://img.shields.io/github/repo-size/GustavoAlbuquerquee/lab02-aluguel-carros?style=for-the-badge&logo=files) ![GitHub language count](https://img.shields.io/github/languages/count/GustavoAlbuquerquee/lab02-aluguel-carros?style=for-the-badge&logo=github) ![GitHub last commit](https://img.shields.io/github/last-commit/GustavoAlbuquerquee/lab02-aluguel-carros?style=for-the-badge&logo=clockify)

---

## 📚 Índice
- [Links Úteis](#-links-úteis)
- [Sobre o Projeto](#-sobre-o-projeto)
- [Funcionalidades Principais](#-funcionalidades-principais)
- [Tecnologias Utilizadas](#-tecnologias-utilizadas)
- [Arquitetura](#-arquitetura)
  - [Diagramas](#diagramas)
  - [Endpoints da API](#endpoints-da-api)
- [Instalação e Execução](#-instalação-e-execução)
  - [Pré-requisitos](#pré-requisitos)
  - [Variáveis de Ambiente](#-variáveis-de-ambiente)
     - [1 Back-end (Spring Boot)](#1-back-end-spring-boot)
     - [2 Front-end (React, Vite)](#2-front-end-react-vite)
     - [3 Exemplos de Variáveis de Ambiente na Vercel](#3-exemplos-de-variáveis-de-ambiente-na-vercel)
  - [Instalação de Dependências](#-instalação-de-dependências)
    - [Front-end (React)](#front-end-react)
    - [Back-end (Spring Boot)](#back-end-spring-boot)
  - [Inicialização do Banco de Dados (PostgreSQL)](#-inicialização-do-banco-de-dados-postgresql)
  - [Como Executar a Aplicação](#-como-executar-a-aplicação)
    - [Terminal 1: Back-end (Spring Boot)](#terminal-1-back-end-spring-boot)
    - [Terminal 2: Front-end (React, Vite)](#terminal-2-front-end-react-vite)
    - [Contas de Teste](#contas-de-teste)
    - [Execução Local Completa com Docker Compose (Incluindo Banco de Dados)](#-execução-local-completa-com-docker-compose-incluindo-banco-de-dados)
- [Deploy](#-deploy)
- [Estrutura de Pastas](#-estrutura-de-pastas)
- [Demonstração](#-demonstração)
  - [Aplicativo Mobile](#-aplicativo-mobile)
  - [Aplicação Web](#-aplicação-web)
  - [Exemplo de saída no Terminal (para Back-end, API, CLI)](#-exemplo-de-saída-no-terminal-para-back-end-api-cli)
- [Testes](#-testes)
- [Documentações utilizadas](#-documentações-utilizadas)
- [Autores](#-autores)
- [Contribuição](#-contribuição)
- [Agradecimentos](#-agradecimentos)
- [Licença](#-licença)

---

## 🔗 Links Úteis
* 🌐 **Demo Online:** ainda não publicada. A aplicação é executada localmente (front-end em `http://localhost:5173` e API em `http://localhost:8080`), conforme a seção [Como Executar a Aplicação](#-como-executar-a-aplicação).
  > 💻 **Descrição:** O projeto é um protótipo acadêmico; não há ambiente de produção hospedado.
* 📱 **Download Mobile:** não se aplica.
  > 📱 **Descrição:** O sistema é exclusivamente web; não há aplicativo mobile.
* 📖 **Documentação:** [Histórias de Usuário](./docs/historias-de-usuario.md) | [Casos de Uso](./docs/diagramas/casos-de-uso.md) | [Diagrama de Classes](./docs/diagramas/classes.md) | [Diagrama de Pacotes](./docs/diagramas/pacotes.md)
  > 📚 **Descrição:** Documentação de análise e projeto do sistema (UML em PlantUML e Mermaid) e a [tabela de endpoints da API](#endpoints-da-api).

---

## 📝 Sobre o Projeto

O **Sistema de Aluguel de Carros** foi desenvolvido como o **Laboratório 02** da disciplina **Desenvolvimento e Integração de Aplicações Web (DIAW)**, do curso de **Engenharia de Software da PUC Minas**, ministrada pelo **Prof. Dr. João Paulo Carneiro Aramuni**.

- **Por que ele existe:** o enunciado propõe um sistema que apoie a gestão de aluguéis de automóveis, permitindo **efetuar, cancelar e modificar pedidos pela Internet**.
- **Qual problema ele resolve:** centraliza o ciclo de vida de um pedido de aluguel — da solicitação pelo cliente até a análise financeira e a assinatura do contrato pelo agente —, registrando o status de cada etapa e, quando necessário, o contrato de crédito concedido por um banco.
- **Qual o contexto:** acadêmico; exercita modelagem UML (casos de uso, histórias de usuário, classes e pacotes), arquitetura MVC e integração entre um back-end REST e um front-end SPA.
- **Onde ele pode ser utilizado:** em locadoras de veículos e instituições financeiras parceiras que precisem receber pedidos de aluguel on-line, avaliá-los e formalizar contratos.

Regras de negócio contempladas:

- O sistema só pode ser usado após **cadastro** e **login** (usuário e senha).
- **Clientes** (pessoas físicas) informam RG, CPF, nome, endereço, profissão e até **3 entidades empregadoras com seus rendimentos**.
- **Agentes** são **empresas** ou **bancos**; eles modificam e avaliam pedidos e, após parecer financeiro positivo, executam o contrato.
- Cada **automóvel** possui matrícula, ano, marca, modelo e placa; conforme o contrato, ele é registrado como propriedade do **cliente**, da **empresa** ou do **banco**.
- Um aluguel pode estar associado a um **contrato de crédito**, que só pode ser concedido por um agente do tipo **banco**.

---

## ✨ Funcionalidades Principais

- 🔐 **Autenticação:** cadastro público de clientes e login com usuário e senha (Spring Security, HTTP Basic, senhas com BCrypt); as telas e ações se adaptam ao perfil (`CLIENTE` ou `AGENTE`).
- 👤 **CRUD de Clientes:** criação, consulta, alteração e exclusão do cadastro, com validação de login e CPF únicos e no máximo **3 rendimentos**. Agentes podem listar e gerenciar clientes.
- 📝 **Pedidos de Aluguel:** o cliente **introduz, modifica, consulta e cancela** pedidos, acompanhando o status (`PENDENTE`, `APROVADO`, `REPROVADO`, `CANCELADO`, `CONTRATADO`).
- 🏦 **Avaliação Financeira:** o agente **avalia** pedidos pendentes (aprovação ou reprovação com parecer) e pode **modificá-los** enquanto pendentes ou aprovados.
- 📄 **Execução de Contrato:** para pedidos aprovados, o agente executa o contrato informando valor e **tipo de proprietário** do automóvel (cliente, empresa ou banco).
- 💳 **Contrato de Crédito:** agentes do tipo **banco** podem associar ao contrato um crédito com valor, taxa de juros e número de parcelas.
- 🚙 **Automóveis:** cadastro de automóveis por agentes e consulta por qualquer usuário autenticado.
- 🌱 **Carga Inicial:** usuários de teste (cliente, empresa e banco) e automóveis criados automaticamente na primeira execução.

---

## 🛠 Tecnologias Utilizadas

As seguintes ferramentas, frameworks e bibliotecas foram utilizados na construção deste projeto. Recomenda-se o uso das versões listadas (ou superiores) para garantir a compatibilidade.

### 💻 Front-end

* **Framework/Biblioteca:** React 19
* **Linguagem/Superset:** JavaScript (ES Modules, JSX)
* **Estilização:** CSS puro
* **Gerenciamento de Estado:** hooks do React (`useState`, `useEffect`); credenciais da sessão no `sessionStorage`
* **Build Tool:** Vite 6

### 🖥️ Back-end

* **Linguagem/Runtime:** Java 25 (JDK 25)
* **Framework:** Spring Boot 4.0.0 (Spring Web MVC, Spring Data JPA, Spring Security 7, Bean Validation) + Lombok
* **Banco de Dados:** PostgreSQL no Supabase (H2 em memória como alternativa para desenvolvimento)
* **ORM / Query Builder:** Hibernate / JPA (Spring Data JPA)
* **Autenticação:** Spring Security com HTTP Basic, sessão *stateless* e senhas com BCrypt

### ⚙️ Infraestrutura & DevOps

* **Build:** Maven (Maven Wrapper `./mvnw`) e npm
* **Cloud:** Supabase (PostgreSQL gerenciado)
* **Versionamento:** Git e GitHub

---

## 🏗 Arquitetura

O sistema adota a arquitetura **MVC** distribuída em dois subsistemas, conforme o enunciado:

1. **Gestão de pedidos e contratos (back-end):** API REST em Spring Boot, pacote `br.pucminas.aluguel`.
   - **Model** — `model` (entidades JPA `Usuario`, `Cliente`, `Agente`, `Rendimento`, `Automovel`, `Pedido`, `Contrato`, `ContratoCredito` e enumerações), `repository` (Spring Data JPA) e `service` (regras de negócio).
   - **Controller** — `controller` (`ClienteController` e `PedidoController`), expõe os endpoints `/api/...` e delega aos serviços; `GlobalExceptionHandler` padroniza as respostas de erro em JSON.
   - **Apoio** — `dto` (requisições de pedido, avaliação e contrato) e `config` (`SecurityConfig` e `DataLoader`).
2. **Construção dinâmica das páginas web (front-end):** SPA em React + Vite que exerce o papel de **View**; o `App.jsx` monta o menu conforme o perfil e renderiza as páginas (`pages`) e componentes (`components`) a partir dos dados obtidos pelo cliente HTTP (`api.js`).

**Fluxo de dados:** o navegador envia requisições JSON com o cabeçalho `Authorization: Basic base64(login:senha)` → o `controller` identifica o usuário autenticado → o `service` aplica as regras de negócio (permissões por perfil, transições de status, limite de rendimentos, crédito apenas por banco) → o `repository` persiste no PostgreSQL (Supabase) via JPA/Hibernate → a resposta JSON é usada pelo React para atualizar a tela. Erros retornam JSON com os campos `timestamp`, `status`, `error`, `message` e `path`.

**Padrões adotados:** MVC, *Repository*, *Service Layer*, DTOs (records Java) e herança JPA `JOINED` para `Usuario` → `Cliente`/`Agente`.

**Decisões e trade-offs:** a autenticação HTTP Basic sem estado simplifica o protótipo (não há emissão de tokens), mas exige HTTPS em produção; o schema é gerado pelo Hibernate (`ddl-auto=update`), dispensando migrações no contexto acadêmico.

### Diagramas

Todos os diagramas possuem fonte em **PlantUML** (`.puml`) e versão em **Mermaid** (`.md`), renderizada diretamente pelo GitHub.

| Artefato | Visualização (Mermaid) | Fonte (PlantUML) |
| :--- | :---: | :---: |
| **Histórias de Usuário** (US01–US19) | [historias-de-usuario.md](./docs/historias-de-usuario.md) | — |
| **Diagrama de Casos de Uso** | [casos-de-uso.md](./docs/diagramas/casos-de-uso.md) | [casos-de-uso.puml](./docs/diagramas/casos-de-uso.puml) |
| **Diagrama de Classes** (domínio e camadas MVC) | [classes.md](./docs/diagramas/classes.md) | [classes.puml](./docs/diagramas/classes.puml) |
| **Diagrama de Pacotes** (visão lógica) | [pacotes.md](./docs/diagramas/pacotes.md) | [pacotes.puml](./docs/diagramas/pacotes.puml) |

### Endpoints da API

Base: `http://localhost:8080`. Exceto o cadastro de cliente, todas as rotas exigem o cabeçalho `Authorization: Basic base64(login:senha)`.

| Método | Rota | Acesso | Descrição |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/auth/me` | Autenticado | Retorna o usuário logado (usado no login); `401` se as credenciais forem inválidas. |
| `POST` | `/api/clientes` | Público | Cadastra um cliente (`nome`, `login`, `senha`, `rg`, `cpf`, `endereco`, `profissao`, `rendimentos` — máx. 3). |
| `GET` | `/api/clientes` | Agente | Lista os clientes. |
| `GET` | `/api/clientes/{id}` | Próprio cliente ou agente | Consulta um cliente. |
| `PUT` | `/api/clientes/{id}` | Próprio cliente ou agente | Atualiza um cliente; senha em branco mantém a atual. |
| `DELETE` | `/api/clientes/{id}` | Próprio cliente ou agente | Exclui um cliente; `409` se houver pedidos. |
| `GET` | `/api/automoveis` | Autenticado | Lista os automóveis. |
| `POST` | `/api/automoveis` | Agente | Cadastra um automóvel (`matricula`, `ano`, `marca`, `modelo`, `placa`). |
| `GET` | `/api/pedidos` | Autenticado | Cliente: seus pedidos; agente: todos os pedidos. |
| `GET` | `/api/pedidos/{id}` | Dono do pedido ou agente | Consulta um pedido. |
| `POST` | `/api/pedidos` | Cliente | Introduz um pedido (`automovelId`, `dataInicio`, `dataFim`). |
| `PUT` | `/api/pedidos/{id}` | Cliente (`PENDENTE`) ou agente (`PENDENTE`/`APROVADO`) | Modifica um pedido. |
| `PATCH` | `/api/pedidos/{id}/cancelar` | Cliente | Cancela um pedido `PENDENTE` ou `APROVADO`. |
| `PATCH` | `/api/pedidos/{id}/avaliar` | Agente | Avalia um pedido `PENDENTE` (`aprovado`, `parecer`) → `APROVADO`/`REPROVADO`. |
| `POST` | `/api/pedidos/{id}/contrato` | Agente | Executa o contrato de um pedido `APROVADO` (`tipoProprietario`, `valor`, `credito`, `valorCredito`, `taxaJuros`, `parcelas`) → `CONTRATADO`. Crédito apenas para agente `BANCO`, com `taxaJuros` ≥ 0 e `parcelas` ≥ 1 obrigatórios. |
| `GET` | `/api/pedidos/{id}/contrato` | Dono do pedido ou agente | Consulta o contrato do pedido. |

---

## 🔧 Instalação e Execução

### Pré-requisitos

* **Java JDK:** versão **25** (necessário para o **Back-end Spring Boot**)
* **Node.js:** versão LTS (v20.x ou superior) (necessário para o **Front-end React**)
* **Gerenciador de Pacotes:** npm
* **Conta no Supabase** (opcional): sem ela o back-end usa H2 em memória
* **Docker** (opcional): apenas se preferir um PostgreSQL local em vez do Supabase

---

### 🔑 Variáveis de Ambiente

#### 1 Back-end (Spring Boot)

Configure estas variáveis como **variáveis de ambiente do sistema** antes de iniciar o back-end. Elas são lidas pelo `backend/src/main/resources/application.properties`.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `SUPABASE_DB_URL` | URL JDBC do PostgreSQL do Supabase. | `jdbc:postgresql://db.<ref>.supabase.co:5432/postgres?sslmode=require` |
| `SUPABASE_DB_USER` | Usuário do banco. | `postgres` |
| `SUPABASE_DB_PASSWORD` | Senha do banco (definida no painel do Supabase). | `sua-senha-do-supabase` |

> [!NOTE]
> Se as variáveis **não** forem definidas, a aplicação usa automaticamente um banco **H2 em memória** (`jdbc:h2:mem:aluguel`), ideal para testes rápidos. Os dados são perdidos ao encerrar a aplicação.

Para obter os valores no Supabase: **Project Settings → Database → Connection string → JDBC**. Substitua `<ref>` pela referência do seu projeto.

```bash
export SUPABASE_DB_URL="jdbc:postgresql://db.<ref>.supabase.co:5432/postgres?sslmode=require"
export SUPABASE_DB_USER="postgres"
export SUPABASE_DB_PASSWORD="sua-senha-do-supabase"
```

No PowerShell:

```powershell
$env:SUPABASE_DB_URL = "jdbc:postgresql://db.<ref>.supabase.co:5432/postgres?sslmode=require"
$env:SUPABASE_DB_USER = "postgres"
$env:SUPABASE_DB_PASSWORD = "sua-senha-do-supabase"
```

#### 2 Front-end (React, Vite)

Opcionalmente, crie um arquivo **`.env.local`** na pasta `frontend` (por exemplo, copiando o `frontend/.env.example`). Sem ele, o front-end usa `http://localhost:8080`.

| Variável | Descrição | Exemplo |
| :--- | :--- | :--- |
| `VITE_API_URL` | URL base do Back-end Spring Boot (sem `/api`). | `http://localhost:8080` |

```
VITE_API_URL=http://localhost:8080
```

> 💡 **Localização:** o arquivo deve ficar em **`/frontend/.env.local`**. Variáveis em projetos **Vite** precisam começar com `VITE_` para ficarem disponíveis no código do cliente.

---

#### 3 Exemplos de Variáveis de Ambiente na Vercel

O projeto ainda não está publicado. Caso o front-end seja hospedado na Vercel (Project Settings → Environment Variables), basta configurar:

```
VITE_API_URL=https://sua-api-publicada.exemplo.com
```

> **Obs:** nesse cenário, a origem do front-end publicado também precisa ser liberada no CORS do `SecurityConfig` (hoje restrito a `http://localhost:5173`).

---

### 📦 Instalação de Dependências

1.  **Clone o Repositório:**

```bash
git clone https://github.com/GustavoAlbuquerquee/lab02-aluguel-carros.git
cd lab02-aluguel-carros
```

2.  **Instale as Dependências (Monorepo):**

#### Front-end (React)

```bash
cd frontend
npm install
cd ..
```

#### Back-end (Spring Boot)

O back-end usa o **Maven Wrapper** (`./mvnw`; no Windows, `mvnw.cmd`):

```bash
cd backend
./mvnw clean install
cd ..
```

---

### 💾 Inicialização do Banco de Dados (PostgreSQL)

O projeto utiliza **PostgreSQL hospedado no Supabase**:

1. Crie um projeto em [supabase.com](https://supabase.com/) e anote a senha do banco.
2. Copie a *connection string* JDBC e configure as variáveis `SUPABASE_DB_URL`, `SUPABASE_DB_USER` e `SUPABASE_DB_PASSWORD` (veja [Variáveis de Ambiente](#-variáveis-de-ambiente)).
3. **Migrações:** não há ação manual. O Hibernate cria e atualiza as tabelas na inicialização (`spring.jpa.hibernate.ddl-auto=update`), e o `DataLoader` insere os dados iniciais quando o banco está vazio.

Alternativa com PostgreSQL local via Docker:

```bash
docker run --name aluguel_db -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=postgres -e POSTGRES_DB=aluguel -p 5432:5432 -d postgres:16
export SUPABASE_DB_URL="jdbc:postgresql://localhost:5432/aluguel"
export SUPABASE_DB_USER="postgres"
export SUPABASE_DB_PASSWORD="postgres"
```

---

### ⚡ Como Executar a Aplicação

Execute a aplicação em modo de desenvolvimento em **dois terminais separados**.

#### Terminal 1: Back-end (Spring Boot)

Com o **JDK 25** configurado (e, opcionalmente, as variáveis do Supabase):

```bash
cd backend
./mvnw spring-boot:run
```
🚀 *O Back-end estará disponível em **http://localhost:8080**.*

---

#### Terminal 2: Front-end (React, Vite)

```bash
cd frontend
npm install
npm run dev
```
🎨 *O Front-end estará disponível em **http://localhost:5173** (origem liberada no CORS da API).*

---

#### Contas de Teste

Criadas automaticamente pelo `DataLoader` quando o banco não possui usuários:

| Perfil | Usuário | Senha | Descrição |
| :--- | :--- | :--- | :--- |
| Cliente | `cliente` | `123456` | Maria Oliveira Santos, com 2 rendimentos cadastrados. |
| Agente (Empresa) | `empresa` | `123456` | Locadora Minas Veículos. |
| Agente (Banco) | `banco` | `123456` | Banco Horizonte S.A. (pode conceder crédito). |

Também são cadastrados 4 automóveis (Volkswagen Gol, Fiat Argo, Chevrolet Onix e Toyota Corolla).

---

#### 🐳 Execução Local Completa com Docker Compose (Incluindo Banco de Dados)

O projeto **não utiliza Docker Compose**: o banco de dados fica no Supabase (ou no H2 em memória) e o back-end e o front-end são executados diretamente com `./mvnw` e `npm`, como descrito acima. Para um PostgreSQL local, use o comando `docker run` da seção [Inicialização do Banco de Dados](#-inicialização-do-banco-de-dados-postgresql).

---

## 🚀 Deploy

1.  **Build do Projeto:**

```bash
cd frontend
npm run build

cd ../backend
./mvnw clean package
```

2.  **Configuração do Ambiente de Produção:** defina `SUPABASE_DB_URL`, `SUPABASE_DB_USER` e `SUPABASE_DB_PASSWORD` no servidor da API e `VITE_API_URL` no build do front-end. Libere a origem do front-end no CORS do `SecurityConfig` e sirva a API via HTTPS (a autenticação é HTTP Basic).

3.  **Execução em Produção:**

```bash
java -jar backend/target/aluguel-0.0.1-SNAPSHOT.jar

npm install -g serve
serve -s frontend/dist
```

---

## 📂 Estrutura de Pastas

```
.
├── README.md                         # 📘 Documentação principal do projeto.
├── docs/                             # 📚 Documentação de análise e projeto
│   ├── historias-de-usuario.md       # 📝 Histórias de usuário (US01–US19) com critérios de aceitação.
│   └── diagramas/                    # 📐 Diagramas UML (PlantUML + Mermaid)
│       ├── casos-de-uso.puml / .md   # 🎭 Diagrama de casos de uso.
│       ├── classes.puml / .md        # 🧬 Diagrama de classes (domínio e camadas MVC).
│       └── pacotes.puml / .md        # 📦 Diagrama de pacotes (visão lógica).
│
├── frontend/                         # 📁 Aplicação React + Vite (View)
│   ├── .env.example                  # 🔑 Exemplo de variável VITE_API_URL.
│   ├── index.html                    # 🌐 Página HTML base.
│   ├── vite.config.js                # ⚙️ Configuração do Vite.
│   ├── package.json                  # 📦 Dependências e scripts.
│   └── src/
│       ├── main.jsx                  # 🚪 Ponto de entrada do React.
│       ├── App.jsx                   # 🧭 Navegação entre páginas conforme o perfil.
│       ├── api.js                    # 🔌 Cliente HTTP da API (Basic Auth).
│       ├── util.js                   # 🛠️ Formatação de datas, moeda e status.
│       ├── pages/                    # 📄 Login, Cadastro, Pedidos, Clientes, Automoveis, Perfil.
│       └── components/               # 🧱 Componentes reutilizáveis (formulário de cliente, UI).
│
└── backend/                          # 📁 API Spring Boot (gestão de pedidos e contratos)
    ├── pom.xml                       # 🛠️ Build e dependências (Maven).
    ├── mvnw / mvnw.cmd               # 🧰 Maven Wrapper.
    └── src/
        ├── main/java/br/pucminas/aluguel/
        │   ├── AluguelApplication.java   # 🚀 Classe principal.
        │   ├── controller/           # 🎮 Endpoints REST (ClienteController, PedidoController) e GlobalExceptionHandler.
        │   ├── service/              # ⚙️ Regras de negócio.
        │   ├── repository/           # 🗄️ Repositórios Spring Data JPA.
        │   ├── model/                # 🧬 Entidades JPA e enumerações.
        │   ├── dto/                  # ✉️ Records de requisição.
        │   └── config/               # 🔧 SecurityConfig (segurança/CORS) e DataLoader (dados iniciais).
        ├── main/resources/
        │   └── application.properties    # ⚙️ Datasource (Supabase/H2) e JPA.
        └── test/java/                # 🧪 Testes (carregamento do contexto Spring).
```

---

## 🎥 Demonstração

### 📱 Aplicativo Mobile

Não se aplica: o sistema é uma aplicação web.

### 🌐 Aplicação Web

O protótipo permite que os usuários criem pedidos de aluguel e acompanhem o seu status. O menu muda conforme o perfil: o **cliente** vê *Meus pedidos*, *Automóveis* e *Meu perfil*; o **agente** vê *Pedidos*, *Clientes* e *Automóveis*. Principais telas:

| Tela | Descrição |
| :--- | :--- |
| **Login** | Acesso com usuário e senha; direciona para as funcionalidades do perfil. |
| **Cadastro** | Cadastro público de cliente, com até 3 rendimentos. |
| **Pedidos** | Cliente: introduz, modifica, cancela e acompanha o status dos pedidos. Agente: modifica, avalia e executa contratos (com crédito, se banco). Ambos consultam o contrato de pedidos contratados. |
| **Clientes** | Exclusiva do agente: lista, visualiza, cadastra, altera e exclui clientes. |
| **Meu perfil** | Exclusiva do cliente: consulta e altera os próprios dados e rendimentos, ou exclui a conta. |
| **Automóveis** | Consulta dos automóveis; cadastro por agentes. |

### 💻 Exemplo de Saída no Terminal (para Back-end, API, CLI)

#### 1. Demonstração da API (Exemplo com cURL)

Login (consulta do usuário autenticado) com a conta de teste do cliente:

```bash
curl -u cliente:123456 http://localhost:8080/api/auth/me
```

**Saída Esperada (formatada; o Jackson 3 ordena as chaves alfabeticamente e nunca devolve a `senha`):**
```json
{
  "cpf": "123.456.789-09",
  "endereco": "Rua da Bahia, 1200, Centro, Belo Horizonte - MG",
  "id": 1,
  "login": "cliente",
  "nome": "Maria Oliveira Santos",
  "perfil": "CLIENTE",
  "profissao": "Analista de Sistemas",
  "rendimentos": [
    { "entidadeEmpregadora": "Tech Minas Ltda", "id": 1, "valor": 6500.00 },
    { "entidadeEmpregadora": "Consultoria Freelancer", "id": 2, "valor": 1800.00 }
  ],
  "rg": "MG-12.345.678"
}
```

---

#### 2. Demonstração do Fluxo de Pedido

Cliente introduz um pedido, o banco aprova e executa o contrato com crédito:

```bash
curl -u cliente:123456 -H "Content-Type: application/json" \
     -d '{"automovelId":1,"dataInicio":"2026-12-01","dataFim":"2026-12-10"}' \
     http://localhost:8080/api/pedidos

curl -u banco:123456 -X PATCH -H "Content-Type: application/json" \
     -d '{"aprovado":true,"parecer":"Renda compatível"}' \
     http://localhost:8080/api/pedidos/1/avaliar

curl -u banco:123456 -H "Content-Type: application/json" \
     -d '{"tipoProprietario":"BANCO","valor":1500.00,"credito":true,"taxaJuros":1.99,"parcelas":10}' \
     http://localhost:8080/api/pedidos/1/contrato
```

**Saída Esperada:** o pedido é criado com `"status": "PENDENTE"`, passa a `"APROVADO"` após a avaliação e a `"CONTRATADO"` após a execução do contrato, que retorna o `contratoCredito` com o banco concedente. Se a última chamada for feita pela conta `empresa`, a API responde `400` com `"message": "Contrato de crédito só pode ser concedido por um banco"`.

---

## 🧪 Testes

### Testes Unitários e de Integração
Para rodar os testes do back-end (verificação do carregamento do contexto Spring com H2):

```
cd backend
./mvnw test
```
*Ferramenta utilizada: JUnit 5 + Spring Boot Test.*

### Testes End-to-End (E2E)
Não há testes E2E automatizados. O fluxo ponta a ponta (cadastro → login → pedido → avaliação → contrato) pode ser validado manualmente com as [contas de teste](#contas-de-teste) ou com os comandos `curl` da seção [Demonstração](#-exemplo-de-saída-no-terminal-para-back-end-api-cli).

---

## 🔗 Documentações utilizadas

* 📖 **Framework/Biblioteca (Front-end):** [Documentação Oficial do **React**](https://react.dev/reference/react)
* 📖 **Build Tool (Front-end):** [Guia de Configuração do **Vite**](https://vitejs.dev/config/)
* 📖 **Framework (Back-end):** [Documentação Oficial do **Spring Boot**](https://docs.spring.io/spring-boot/index.html)
* 📖 **Segurança:** [Documentação do **Spring Security**](https://docs.spring.io/spring-security/reference/index.html)
* 📖 **Persistência:** [Documentação do **Spring Data JPA**](https://docs.spring.io/spring-data/jpa/reference/index.html)
* 📖 **Banco de Dados:** [Documentação do **Supabase** (Database)](https://supabase.com/docs/guides/database/overview)
* 📖 **Diagramas:** [**PlantUML**](https://plantuml.com/) e [**Mermaid**](https://mermaid.js.org/)
* 📖 **Guia de Estilo:** [**Conventional Commits** (Padrão de Mensagens)](https://www.conventionalcommits.org/en/v1.0.0/)
* 📖 **Documentação Interna:** [Histórias de Usuário](./docs/historias-de-usuario.md) e [Diagramas](./docs/diagramas/)

---

## 👥 Autores

| 👤 Nome | 🖼️ Foto | :octocat: GitHub | 📤 Gmail |
|---------|----------|-----------------|-----------|
| Gustavo Albuquerque | <div align="center"><img src="https://github.com/GustavoAlbuquerquee.png" width="70px" height="70px"></div> | <div align="center"><a href="https://github.com/GustavoAlbuquerquee"><img src="https://joaopauloaramuni.github.io/image/github6.png" width="50px" height="50px"></a></div> | <div align="center"><a href="mailto:gustavoalbuquerque807@gmail.com"><img src="https://joaopauloaramuni.github.io/image/gmail3.png" width="50px" height="50px"></a></div> |

**Professor:** [Prof. Dr. João Paulo Carneiro Aramuni](https://github.com/joaopauloaramuni) — Desenvolvimento e Integração de Aplicações Web (DIAW), Engenharia de Software, PUC Minas.

---

## 🤝 Contribuição

1.  Faça um `fork` do projeto.
2.  Crie uma branch para sua feature (`git checkout -b feature/minha-feature`).
3.  Faça commit das suas mudanças (`git commit -m 'feat: adiciona nova funcionalidade X'`). **(Utilize [Conventional Commits](https://www.conventionalcommits.org/en/v1.0.0/))**
4.  Faça o `push` para a branch (`git push origin feature/minha-feature`).
5.  Abra um **Pull Request (PR)**.

> [!IMPORTANT]
> 📝 **Regras:** mantenha a arquitetura MVC (controller → service → repository → model) e atualize as histórias de usuário e os diagramas em `docs/` ao alterar regras de negócio ou o modelo de domínio.

---

## 🙏 Agradecimentos

* [**Engenharia de Software PUC Minas**](https://www.instagram.com/engsoftwarepucminas/) - Pelo apoio institucional, estrutura acadêmica e fomento à inovação e boas práticas de engenharia.
* [**Prof. Dr. João Paulo Carneiro Aramuni**](https://github.com/joaopauloaramuni) - Pela orientação na disciplina de **Desenvolvimento e Integração de Aplicações Web** e pelo template de documentação utilizado neste README.

---

## 📄 Licença

Este projeto é distribuído sob a **[Licença MIT](https://opensource.org/licenses/MIT)**.

---
