# Solução para o erro "Unexpected token '<', "<!DOCTYPE "... is not valid JSON"

## Problema

O erro ocorre quando o frontend tenta fazer login e recebe HTML ao invés de JSON da API.

## Causas comuns

1. O servidor backend não está rodando
2. O servidor está rodando na porta errada
3. O proxy do Vite não está configurado corretamente
4. A variável de ambiente `VITE_API_URL` está incorreta

## Solução implementada

### 1. Arquivo `.env` criado

Foi criado o arquivo `client/.env` com a configuração:

```
VITE_API_URL=/api
```

### 2. Proxy do Vite atualizado

O arquivo `client/vite.config.js` foi atualizado com configurações mais robustas:

```javascript
proxy: {
  '/api': {
    target: 'http://localhost:4000',
    changeOrigin: true,
    secure: false,
  }
}
```

### 3. Tratamento de erro aprimorado

O arquivo `client/src/store/useFluxStore.jsx` foi atualizado para:

- Verificar se a resposta é JSON antes de tentar parsear
- Exibir mensagens de erro mais claras
- Capturar erros de rede

## Como verificar se está funcionando

### 1. Verificar se o servidor está rodando

```powershell
netstat -ano | findstr :4000
```

Deve mostrar que a porta 4000 está em uso.

### 2. Testar a API diretamente

```powershell
curl http://localhost:4000/api/auth/login -Method POST -ContentType "application/json" -Body '{"username":"flux","password":"123456"}'
```

Deve retornar JSON com token e dados do usuário.

### 3. Reiniciar o servidor de desenvolvimento

```powershell
# No diretório client
cd client
npm run dev
```

### 4. Verificar o console do navegador

Abra as ferramentas de desenvolvimento (F12) e verifique:

- Aba Network: veja se a requisição para `/api/auth/login` retorna 200 OK
- Aba Console: veja se há erros de CORS ou conexão

## Comandos para iniciar o projeto

### Terminal 1 - Backend

```powershell
cd server
npm install
npm start
```

### Terminal 2 - Frontend

```powershell
cd client
npm install
npm run dev
```

## Notas importantes

- O arquivo `.env` não é commitado no git por padrão (deve estar no `.gitignore`)
- Se mudar o `.env`, é necessário reiniciar o servidor de desenvolvimento do Vite
- O proxy só funciona em desenvolvimento, para produção use a URL completa da API
