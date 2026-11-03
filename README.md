# Sistema de Aluguel de Carros - LAB02 DIAW

Sistema web para gestão de aluguéis de automóveis: clientes introduzem, modificam, consultam e cancelam pedidos; agentes (empresas e bancos) avaliam pedidos e executam contratos (com crédito concedido por bancos).

## Stack
- Java (JDK 25) + Spring Boot 4.0 + Maven (arquitetura MVC)
- React + Vite
- Supabase (PostgreSQL)
- Autenticação com usuário e senha (Spring Security + BCrypt)

## Estrutura
- `backend/` - API Spring Boot (model, repository, service, controller, dto, config)
- `frontend/` - aplicação React + Vite

## Como executar
```bash
cd backend
SUPABASE_DB_URL=jdbc:postgresql://db.<ref>.supabase.co:5432/postgres?sslmode=require SUPABASE_DB_USER=postgres SUPABASE_DB_PASSWORD=<senha> ./mvnw spring-boot:run
```
```bash
cd frontend && npm install && npm run dev
```
