# Histórias de Usuário — Sistema de Aluguel de Carros

Histórias de usuário do LAB02 (DIAW — PUC Minas). Cada história segue o formato **Como &lt;papel&gt;, quero &lt;ação&gt;, para &lt;benefício&gt;** e traz critérios de aceitação verificáveis.

## Papéis

| Papel | Descrição |
| :--- | :--- |
| **Usuário** | Qualquer pessoa que acessa o sistema (ainda não autenticada). |
| **Cliente** | Pessoa física que solicita aluguéis de automóveis. |
| **Agente** | Empresa ou banco que avalia pedidos e executa contratos. |
| **Agente Empresa** | Agente do tipo `EMPRESA` (locadora). |
| **Agente Banco** | Agente do tipo `BANCO`; além do papel de agente, pode conceder contrato de crédito. |

## Resumo

| ID | História | Papel | Caso de uso |
| :--- | :--- | :--- | :--- |
| US01 | Cadastrar-se como cliente | Usuário | Cadastrar-se |
| US02 | Realizar login | Cliente / Agente | Realizar login |
| US03 | Consultar meus dados cadastrais | Cliente | Manter cadastro |
| US04 | Alterar meus dados cadastrais | Cliente | Manter cadastro |
| US05 | Excluir meu cadastro | Cliente | Manter cadastro |
| US06 | Informar empregadores e rendimentos (máx. 3) | Cliente | Informar rendimentos (máx. 3) |
| US07 | Consultar clientes cadastrados | Agente | Consultar clientes |
| US08 | Introduzir pedido de aluguel | Cliente | Introduzir pedido |
| US09 | Consultar pedidos e seus status | Cliente / Agente | Consultar pedido |
| US10 | Modificar pedido (cliente) | Cliente | Modificar pedido |
| US11 | Cancelar pedido | Cliente | Cancelar pedido |
| US12 | Modificar pedido (agente) | Agente | Modificar pedido |
| US13 | Avaliar pedido financeiramente | Agente | Avaliar pedido |
| US14 | Executar contrato de aluguel | Agente | Executar contrato |
| US15 | Conceder contrato de crédito | Agente Banco | Conceder crédito |
| US16 | Registrar a propriedade do automóvel | Agente | Registrar propriedade do automóvel |
| US17 | Consultar o contrato de um pedido | Cliente / Agente | Consultar pedido |
| US18 | Cadastrar automóveis | Agente | Cadastrar automóvel |
| US19 | Consultar automóveis disponíveis | Cliente / Agente | Consultar automóveis |

Todas as histórias estão implementadas no back-end (API REST) e no front-end (telas Login, Cadastro, Pedidos, Clientes, Automóveis e Meu perfil).

---

## Acesso e cadastro

### US01 — Cadastrar-se como cliente

**Como** usuário não cadastrado, **quero** criar minha conta informando meus dados pessoais, login e senha, **para** poder solicitar aluguéis de automóveis.

**Critérios de aceitação**
- O formulário solicita nome, login, senha, RG, CPF, endereço, profissão e até 3 rendimentos (entidade empregadora e valor).
- Nome, login, senha, RG e CPF são obrigatórios.
- Não é permitido cadastrar um login ou CPF já existente (o sistema exibe "Login já cadastrado" ou "CPF já cadastrado").
- A senha é armazenada criptografada (BCrypt) e nunca é devolvida pela API.
- O cadastro é público (`POST /api/clientes`) e, ao concluir, o cliente pode realizar login.

### US02 — Realizar login

**Como** cliente ou agente, **quero** entrar no sistema com usuário e senha, **para** acessar as funcionalidades do meu perfil.

**Critérios de aceitação**
- O login é feito com usuário e senha; credenciais inválidas exibem "Usuário ou senha inválidos".
- Após o login, o sistema identifica o perfil (`CLIENTE` ou `AGENTE`) e mostra apenas as ações permitidas a ele.
- Todas as funcionalidades, exceto o cadastro de cliente, exigem autenticação.
- O usuário pode sair (logout), encerrando a sessão no navegador.

### US03 — Consultar meus dados cadastrais

**Como** cliente, **quero** visualizar meus dados cadastrais, **para** conferir se estão corretos.

**Critérios de aceitação**
- Na tela "Meu perfil", o cliente vê nome, login, RG, CPF, endereço, profissão e rendimentos.
- Um cliente não consegue consultar os dados de outro cliente (resposta 403).

### US04 — Alterar meus dados cadastrais

**Como** cliente, **quero** atualizar meus dados cadastrais, **para** mantê-los corretos para a análise dos pedidos.

**Critérios de aceitação**
- É possível alterar nome, login, RG, CPF, endereço, profissão, rendimentos e senha.
- Se a senha for deixada em branco, a senha atual é mantida.
- Login e CPF continuam únicos no sistema.
- Um agente também pode alterar os dados de um cliente.

### US05 — Excluir meu cadastro

**Como** cliente, **quero** excluir minha conta, **para** deixar de utilizar o sistema.

**Critérios de aceitação**
- O sistema pede confirmação antes de excluir.
- Um cliente que possui pedidos não pode ser excluído (resposta 409 com a mensagem "Cliente possui pedidos e não pode ser excluído").
- Após a exclusão, o login deixa de funcionar e o usuário precisa se cadastrar novamente para usar o sistema.

### US06 — Informar empregadores e rendimentos

**Como** cliente, **quero** informar minhas entidades empregadoras e os respectivos rendimentos, **para** que os agentes possam avaliar minha capacidade financeira.

**Critérios de aceitação**
- Cada rendimento possui entidade empregadora e valor (maior ou igual a zero).
- O cliente pode ter no máximo 3 rendimentos; a tentativa de informar mais é rejeitada.
- Os rendimentos podem ser adicionados, alterados ou removidos na edição do cadastro.

### US07 — Consultar clientes cadastrados

**Como** agente, **quero** listar os clientes cadastrados, **para** apoiar a análise dos pedidos.

**Critérios de aceitação**
- Somente agentes acessam a listagem (`GET /api/clientes`).
- A listagem mostra os dados cadastrais e os rendimentos de cada cliente.
- A partir da listagem, o agente pode visualizar, cadastrar, alterar e excluir clientes (mesmas regras de US01, US04 e US05).

---

## Pedidos de aluguel

### US08 — Introduzir pedido de aluguel

**Como** cliente, **quero** criar um pedido de aluguel escolhendo um automóvel e o período, **para** solicitar a locação.

**Critérios de aceitação**
- O cliente escolhe um automóvel cadastrado e informa data de início e data de fim.
- A data de fim não pode ser anterior à data de início.
- O pedido é criado com status `PENDENTE` e com a data de criação registrada.
- Apenas clientes podem introduzir pedidos.

### US09 — Consultar pedidos e seus status

**Como** cliente ou agente, **quero** visualizar os pedidos e o status de cada um, **para** acompanhar o andamento das solicitações.

**Critérios de aceitação**
- O cliente vê apenas os próprios pedidos; o agente vê todos os pedidos.
- Cada pedido exibe automóvel, período, status (`PENDENTE`, `APROVADO`, `REPROVADO`, `CANCELADO`, `CONTRATADO`), parecer e agente avaliador, quando houver.
- Os pedidos mais recentes aparecem primeiro.

### US10 — Modificar pedido (cliente)

**Como** cliente, **quero** alterar o automóvel ou o período de um pedido, **para** corrigir ou ajustar minha solicitação.

**Critérios de aceitação**
- O cliente só modifica pedidos próprios e com status `PENDENTE`.
- As mesmas validações da criação se aplicam (automóvel existente e datas coerentes).

### US11 — Cancelar pedido

**Como** cliente, **quero** cancelar um pedido, **para** desistir de um aluguel que não desejo mais.

**Critérios de aceitação**
- Somente pedidos com status `PENDENTE` ou `APROVADO` podem ser cancelados.
- O sistema pede confirmação e altera o status para `CANCELADO`.
- Pedidos `CANCELADO` não podem mais ser modificados, avaliados ou contratados.

---

## Atuação dos agentes

### US12 — Modificar pedido (agente)

**Como** agente, **quero** modificar um pedido, **para** ajustar condições negociadas com o cliente antes da contratação.

**Critérios de aceitação**
- O agente pode modificar pedidos com status `PENDENTE` ou `APROVADO`.
- Pedidos `REPROVADO`, `CANCELADO` ou `CONTRATADO` não podem ser modificados.

### US13 — Avaliar pedido financeiramente

**Como** agente, **quero** aprovar ou reprovar um pedido com um parecer, **para** registrar o resultado da análise financeira.

**Critérios de aceitação**
- Somente pedidos `PENDENTE` podem ser avaliados.
- O agente informa a decisão (aprovar ou reprovar) e um parecer opcional.
- O status passa para `APROVADO` ou `REPROVADO` e o agente fica registrado como avaliador.
- O cliente passa a visualizar o novo status e o parecer.

### US14 — Executar contrato de aluguel

**Como** agente, **quero** executar o contrato de um pedido aprovado, **para** formalizar o aluguel do automóvel.

**Critérios de aceitação**
- Somente pedidos `APROVADO` (com parecer financeiro positivo) podem ser contratados.
- O contrato registra o valor, a data de assinatura e o tipo de proprietário do automóvel.
- Após a execução, o pedido passa para o status `CONTRATADO`.
- Cada pedido possui no máximo um contrato.

### US15 — Conceder contrato de crédito

**Como** agente do tipo banco, **quero** associar um contrato de crédito ao contrato de aluguel, **para** financiar o aluguel do cliente.

**Critérios de aceitação**
- Apenas agentes do tipo `BANCO` podem conceder crédito; para agentes `EMPRESA` a opção é recusada com a mensagem "Contrato de crédito só pode ser concedido por um banco".
- O contrato de crédito registra o banco concedente, o valor (por padrão, o valor do contrato), a taxa de juros e o número de parcelas.
- O valor do crédito, quando informado, deve ser maior que zero; a taxa de juros é obrigatória e não pode ser negativa; o número de parcelas é obrigatório e deve ser no mínimo 1.
- O contrato de crédito é salvo junto com o contrato de aluguel.

### US16 — Registrar a propriedade do automóvel

**Como** agente, **quero** indicar, no contrato, de quem é a propriedade do automóvel, **para** cumprir a regra de registro conforme o tipo de contrato.

**Critérios de aceitação**
- O tipo de proprietário é obrigatório e pode ser `CLIENTE`, `EMPRESA` ou `BANCO`.
- O tipo de proprietário fica visível na consulta do contrato.

### US17 — Consultar o contrato de um pedido

**Como** cliente ou agente, **quero** consultar o contrato de um pedido contratado, **para** conhecer suas condições.

**Critérios de aceitação**
- São exibidos valor, data de assinatura, tipo de proprietário e, se houver, os dados do contrato de crédito (banco, valor, taxa de juros e parcelas).
- O cliente só consulta contratos dos próprios pedidos.
- Pedidos sem contrato retornam "Pedido sem contrato".

---

## Automóveis

### US18 — Cadastrar automóveis

**Como** agente, **quero** cadastrar automóveis, **para** disponibilizá-los nos pedidos de aluguel.

**Critérios de aceitação**
- O automóvel possui matrícula, ano, marca, modelo e placa, todos obrigatórios.
- Matrícula e placa são únicas.
- Somente agentes cadastram automóveis (`POST /api/automoveis`).

### US19 — Consultar automóveis disponíveis

**Como** cliente ou agente autenticado, **quero** listar os automóveis cadastrados, **para** escolher um automóvel ao criar ou modificar um pedido.

**Critérios de aceitação**
- A listagem mostra matrícula, ano, marca, modelo e placa.
- Qualquer usuário autenticado pode consultar a listagem.
