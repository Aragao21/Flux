# Arquitetura Flux

## Visão geral
- **Front-end**: React (Vite) com Tailwind e Zustand para estado global. Comunicação com `/api` via fetch.
- **Back-end**: Node.js + Express. Rotas REST para PIX, pagamentos, recargas, extrato e login simulado.
- **Banco**: SQLite local em `data/flux.db` com tabelas `users` e `transactions`.

## Diagrama de componentes (Mermaid)
```mermaid
graph LR
  UI[Front-end React/Tailwind] -- fetch --> API[Express API]
  UI -- proxy 5173/4000 --> API
  API -- SQLite driver --> DB[(flux.db)]
  subgraph Client
    UI
  end
  subgraph Server
    API
    DB
  end
```

## Diagrama UML de casos de uso
```mermaid
usecaseDiagram
  actor Usuario
  rectangle Flux {
    usecase EnviarPIX as "Enviar PIX"
    usecase ReceberPIX as "Receber PIX"
    usecase PagarConta as "Pagar conta"
    usecase Recarregar as "Recarga"
    usecase ConsultarExtrato as "Extrato inteligente"
  }
  Usuario --> EnviarPIX
  Usuario --> ReceberPIX
  Usuario --> PagarConta
  Usuario --> Recarregar
  Usuario --> ConsultarExtrato
```

## Modelo E-R simplificado
```mermaid
erDiagram
  USERS ||--o{ TRANSACTIONS : registra
  USERS {
    int id PK
    string username
    string password
    string name
    float balance
  }
  TRANSACTIONS {
    int id PK
    string type
    string direction
    float amount
    string party
    string description
    string category
    datetime created_at
  }
```

## Fluxo de categorização
- PIX enviado → categoria **Transferência** (saída)
- PIX recebido → **Recebimento** (entrada)
- Recarga → **Telefone** (saída)
- Pagamento → **Contas** (saída)

## Rotas principais
- `POST /api/auth/login`
- `POST /api/pix/send`
- `POST /api/pix/receive`
- `POST /api/payments`
- `POST /api/recharges`
- `GET /api/transactions`
- `GET /api/summary`

## Convenções visuais
- Primária: vermelho Claro `#ED1C24`.
- Fundo claro, alto contraste, botões arredondados e tipografia Inter.
