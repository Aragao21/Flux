# Flux — Hub Financeiro Simulado

Aplicação full-stack (frontend Vite + React + Tailwind, backend Node.js + Express + SQLite) que simula um hub financeiro móvel com módulos de PIX, pagamento de contas, recarga e extrato inteligente categorizado.

## Estrutura
- `client/`: Front-end React com Tailwind e gráfico de categorias (Chart.js).
- `server/`: API Express com persistência SQLite e regras de categorização.
- `docs/`: Diagramas e documentação de arquitetura.
- `data/`: Banco SQLite gerado localmente.

## Rodando localmente
1. Instale dependências em `server/` e `client/` (`npm install`).
2. Inicie a API: `npm run start` em `server/` (porta 4000).
3. Inicie o front: `npm run dev` em `client/` (porta 5173, proxy para a API).

Credenciais simuladas de login:
- **flux / 123456** (admin)
- **danilo / senha123**
- **flavia / senha123**
- **joao / senha123**

## Funcionalidades
- PIX (envio direto, sem QR) com comprovante fake, contestação rápida e registro no extrato.
- Pagamento de contas, recarga de celular e serviços (cashback, seguro e empréstimo) com lançamentos categorizados.
- Extrato inteligente com cores/ícones e gráfico por categoria, incluindo marcação de contestação e filtro por usuário logado.
- Campos monetários com máscara automática (vírgula fixa para centavos) para evitar erros de digitação.
- UI inspirada na paleta Claro (vermelho #ED1C24) mantendo a identidade Flux.
- Perfil editável (nome, email, senha), saudação personalizada e logout visível.

Para diagramas e detalhes, veja `docs/architecture.md`.
