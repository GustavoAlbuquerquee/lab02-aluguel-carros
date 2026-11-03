# Diagrama de Classes

Fonte PlantUML: [`classes.puml`](./classes.puml) (contém dois diagramas: `classes`, com o modelo de domínio, e `classes-camadas`, com as camadas MVC). As versões abaixo usam Mermaid para visualização direta no GitHub e refletem exatamente o código em `backend/src/main/java/br/pucminas/aluguel`.

## 1. Modelo de domínio (`model`)

```mermaid
classDiagram
    direction TB

    class Usuario {
        <<abstract>>
        -Long id
        -String login
        -String senha
        -String nome
        +getPerfil() Perfil*
    }

    class Cliente {
        -String rg
        -String cpf
        -String endereco
        -String profissao
        -List~Rendimento~ rendimentos
        +getPerfil() Perfil
    }

    class Agente {
        -String cnpj
        -TipoAgente tipo
        +getPerfil() Perfil
    }

    class Rendimento {
        -Long id
        -String entidadeEmpregadora
        -BigDecimal valor
    }

    class Automovel {
        -Long id
        -String matricula
        -Integer ano
        -String marca
        -String modelo
        -String placa
    }

    class Pedido {
        -Long id
        -Cliente cliente
        -Automovel automovel
        -LocalDate dataInicio
        -LocalDate dataFim
        -StatusPedido status
        -String parecer
        -Agente agenteAvaliador
        -LocalDateTime dataCriacao
    }

    class Contrato {
        -Long id
        -Pedido pedido
        -TipoProprietario tipoProprietario
        -BigDecimal valor
        -LocalDate dataAssinatura
        -ContratoCredito contratoCredito
    }

    class ContratoCredito {
        -Long id
        -Agente banco
        -BigDecimal valor
        -BigDecimal taxaJuros
        -Integer parcelas
    }

    class Perfil {
        <<enumeration>>
        CLIENTE
        AGENTE
    }

    class TipoAgente {
        <<enumeration>>
        EMPRESA
        BANCO
    }

    class StatusPedido {
        <<enumeration>>
        PENDENTE
        APROVADO
        REPROVADO
        CANCELADO
        CONTRATADO
    }

    class TipoProprietario {
        <<enumeration>>
        CLIENTE
        EMPRESA
        BANCO
    }

    Usuario <|-- Cliente
    Usuario <|-- Agente
    Usuario ..> Perfil

    Cliente "1" *-- "0..3" Rendimento : rendimentos
    Pedido "*" --> "1" Cliente : cliente
    Pedido "*" --> "1" Automovel : automovel
    Pedido "*" --> "0..1" Agente : agenteAvaliador
    Pedido --> StatusPedido : status
    Contrato "0..1" --> "1" Pedido : pedido
    Contrato "1" *-- "0..1" ContratoCredito : contratoCredito
    Contrato --> TipoProprietario : tipoProprietario
    ContratoCredito "*" --> "1" Agente : banco
    Agente --> TipoAgente : tipo
```

### Regras e restrições do modelo

| Elemento | Detalhe |
| :--- | :--- |
| `Usuario` | Classe abstrata com herança JPA `JOINED` (tabelas `usuario`, `cliente`, `agente`). `login` é único; `senha` é gravada com BCrypt e é somente escrita no JSON (`WRITE_ONLY`). |
| `Cliente.rendimentos` | `@OneToMany` unidirecional (coluna `cliente_id` em `rendimento`), `EAGER`, `cascade = ALL`, `orphanRemoval`, limitado a **3** itens (`@Size(max = 3)`). |
| `Cliente.cpf` / `Agente.cnpj` | Únicos. |
| `Automovel.matricula` / `Automovel.placa` | Únicos e obrigatórios. |
| `Pedido.status` | Inicia em `PENDENTE`; `dataCriacao` recebe `LocalDateTime.now()`. |
| `Contrato.pedido` | `@OneToOne(optional = false)`: cada pedido tem no máximo um contrato. `dataAssinatura` recebe `LocalDate.now()`. |
| `Contrato.tipoProprietario` | Define se o automóvel fica registrado como propriedade do `CLIENTE`, da `EMPRESA` ou do `BANCO`. |
| `Contrato.contratoCredito` | `@OneToOne(cascade = ALL)`, opcional; concedido apenas por `Agente` com `tipo = BANCO`. |

## 2. Camadas MVC (`controller`, `service`, `repository`, `dto`, `config`)

```mermaid
classDiagram
    direction LR

    class ClienteController {
        <<RestController>>
        +me(Authentication auth) Usuario
        +criar(Cliente cliente) Cliente
        +listar() List~Cliente~
        +buscar(Long id, Authentication auth) Cliente
        +atualizar(Long id, Cliente cliente, Authentication auth) Cliente
        +excluir(Long id, Authentication auth) void
    }

    class PedidoController {
        <<RestController>>
        +automoveis() List~Automovel~
        +criarAutomovel(Automovel automovel) Automovel
        +listar(Authentication auth) List~Pedido~
        +buscar(Long id, Authentication auth) Pedido
        +criar(PedidoRequest req, Authentication auth) Pedido
        +modificar(Long id, PedidoRequest req, Authentication auth) Pedido
        +cancelar(Long id, Authentication auth) Pedido
        +avaliar(Long id, AvaliacaoRequest req, Authentication auth) Pedido
        +contratar(Long id, ContratoRequest req, Authentication auth) Contrato
        +contrato(Long id, Authentication auth) Contrato
    }

    class GlobalExceptionHandler {
        <<RestControllerAdvice>>
        +status(ResponseStatusException ex, HttpServletRequest req) ResponseEntity
        +validacao(MethodArgumentNotValidException ex, HttpServletRequest req) ResponseEntity
        +corpoInvalido(HttpMessageNotReadableException ex, HttpServletRequest req) ResponseEntity
        +integridade(DataIntegrityViolationException ex, HttpServletRequest req) ResponseEntity
        -formatar(FieldError erro) String
        -corpo(HttpStatus status, String mensagem, HttpServletRequest req) ResponseEntity
    }

    class AluguelApplication {
        <<SpringBootApplication>>
        +main(String[] args) void$
    }

    class UsuarioService {
        <<Service>>
        +loadUserByUsername(String login) UserDetails
        +atual(Authentication auth) Usuario
    }

    class ClienteService {
        <<Service>>
        +criar(Cliente cliente) Cliente
        +listar() List~Cliente~
        +buscar(Long id, Usuario solicitante) Cliente
        +atualizar(Long id, Cliente dados, Usuario solicitante) Cliente
        +excluir(Long id, Usuario solicitante) void
        -copiarRendimentos(List~Rendimento~ origem) List~Rendimento~
        -verificarAcesso(Long id, Usuario solicitante) void
    }

    class AutomovelService {
        <<Service>>
        +listar() List~Automovel~
        +buscar(Long id) Automovel
        +criar(Automovel automovel) Automovel
        +atualizar(Long id, Automovel dados) Automovel
        +excluir(Long id) void
    }

    class PedidoService {
        <<Service>>
        +listar(Usuario usuario) List~Pedido~
        +buscar(Long id, Usuario usuario) Pedido
        +criar(PedidoRequest req, Usuario usuario) Pedido
        +modificar(Long id, PedidoRequest req, Usuario usuario) Pedido
        +cancelar(Long id, Usuario usuario) Pedido
        +avaliar(Long id, AvaliacaoRequest req, Usuario usuario) Pedido
        +contratar(Long id, ContratoRequest req, Usuario usuario) Contrato
        +buscarContrato(Long id, Usuario usuario) Contrato
        -validarCredito(ContratoRequest req) void
        -preencher(Pedido pedido, PedidoRequest req) void
    }

    class UsuarioRepository {
        <<interface>>
        +findByLogin(String login) Optional~Usuario~
        +existsByLogin(String login) boolean
    }

    class ClienteRepository {
        <<interface>>
        +existsByCpf(String cpf) boolean
    }

    class AgenteRepository {
        <<interface>>
    }

    class AutomovelRepository {
        <<interface>>
        +existsByMatricula(String matricula) boolean
        +existsByPlaca(String placa) boolean
    }

    class PedidoRepository {
        <<interface>>
        +findByClienteIdOrderByIdDesc(Long clienteId) List~Pedido~
        +findAllByOrderByIdDesc() List~Pedido~
        +existsByClienteId(Long clienteId) boolean
        +existsByAutomovelId(Long automovelId) boolean
    }

    class ContratoRepository {
        <<interface>>
        +findByPedidoId(Long pedidoId) Optional~Contrato~
    }

    class JpaRepository {
        <<interface>>
    }

    class PedidoRequest {
        <<record>>
        +Long automovelId
        +LocalDate dataInicio
        +LocalDate dataFim
    }

    class AvaliacaoRequest {
        <<record>>
        +Boolean aprovado
        +String parecer
    }

    class ContratoRequest {
        <<record>>
        +TipoProprietario tipoProprietario
        +BigDecimal valor
        +boolean credito
        +BigDecimal valorCredito
        +BigDecimal taxaJuros
        +Integer parcelas
    }

    class SecurityConfig {
        <<Configuration>>
        +filterChain(HttpSecurity http) SecurityFilterChain
        +passwordEncoder() PasswordEncoder
        +corsConfigurationSource() CorsConfigurationSource
    }

    class DataLoader {
        <<Component>>
        -String SENHA_PADRAO$
        +run(String... args) void
        -criarCliente() Cliente
        -criarRendimento(String entidade, BigDecimal valor) Rendimento
        -criarAgente(String login, String nome, String cnpj, TipoAgente tipo) Agente
        -criarAutomovel(String matricula, int ano, String marca, String modelo, String placa) Automovel
    }

    class UserDetailsService {
        <<interface>>
    }

    class CommandLineRunner {
        <<interface>>
    }

    UserDetailsService <|.. UsuarioService
    CommandLineRunner <|.. DataLoader

    JpaRepository <|-- UsuarioRepository
    JpaRepository <|-- ClienteRepository
    JpaRepository <|-- AgenteRepository
    JpaRepository <|-- AutomovelRepository
    JpaRepository <|-- PedidoRepository
    JpaRepository <|-- ContratoRepository

    ClienteController --> ClienteService
    ClienteController --> UsuarioService
    PedidoController --> PedidoService
    PedidoController --> AutomovelService
    PedidoController --> UsuarioService
    PedidoController ..> PedidoRequest
    PedidoController ..> AvaliacaoRequest
    PedidoController ..> ContratoRequest

    UsuarioService --> UsuarioRepository
    ClienteService --> ClienteRepository
    ClienteService --> UsuarioRepository
    ClienteService --> PedidoRepository
    AutomovelService --> AutomovelRepository
    AutomovelService --> PedidoRepository
    PedidoService --> PedidoRepository
    PedidoService --> ContratoRepository
    PedidoService --> AutomovelService

    ClienteService ..> SecurityConfig : usa PasswordEncoder
    DataLoader ..> UsuarioRepository
    DataLoader ..> AutomovelRepository
    DataLoader ..> SecurityConfig : usa PasswordEncoder
```

Observações sobre as camadas:

- Os repositórios estendem `JpaRepository<T, ID>` com `ID = Long` e `T` igual à entidade correspondente (`Usuario`, `Cliente`, `Agente`, `Automovel`, `Pedido`, `Contrato`).
- Os métodos do `GlobalExceptionHandler` retornam `ResponseEntity<Map<String, Object>>`, com o corpo `{timestamp, status, error, message, path}`; no Mermaid o tipo aparece simplificado como `ResponseEntity`.
- `ClienteService` e `DataLoader` recebem o `PasswordEncoder` (BCrypt) declarado como `@Bean` em `SecurityConfig`.
- `AutomovelService.atualizar()` e `AutomovelService.excluir()` existem na camada de serviço, mas não são expostos por endpoint REST: a API oferece apenas `GET` e `POST /api/automoveis`.
