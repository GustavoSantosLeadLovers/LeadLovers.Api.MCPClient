# Guia de Instalação e Configuração - LeadLovers MCP Platform

> 🚀 Guia completo para instalação e configuração do monorepo LeadLovers MCP (Client + Server)

## 📋 Pré-requisitos

### Software Necessário

- **Node.js**: versão 20.x ou superior
- **npm**: versão 10.x ou superior (incluso com Node.js)
- **pnpm**: versão 10.15.1 ou superior (para MCPServer)
- **Git**: para clonar o repositório
- **Redis** (opcional): para cache de sessões em produção

### Verificação de Pré-requisitos

```bash
# Verificar versão do Node.js
node --version
# Deve retornar v20.x.x ou superior

# Verificar versão do npm
npm --version
# Deve retornar 10.x.x ou superior

# Instalar pnpm globalmente (necessário para MCPServer)
npm install -g pnpm@10.15.1
pnpm --version
# Deve retornar 10.15.1

# Verificar se o Git está instalado
git --version
```

## 🚀 Instalação

### 1. Clonar o Repositório

```bash
# Clone via HTTPS
git clone https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient.git

# OU via SSH (se configurado)
git clone git@github.com:GustavoSantosLeadLovers/LeadLovers.Api.MCPClient.git

# Navegue para o diretório do projeto
cd LeadLovers.Api.MCPClient
```

### 2. Instalar Dependências

#### MCPClient (API Gateway)
```bash
# Navegar para o diretório do MCPClient
cd LeadLovers.Api.MCPClient

# Instalar dependências com npm
npm install

# Verificar se a instalação foi bem-sucedida
npm list --depth=0
```

#### MCPServer (MCP Tools)
```bash
# Navegar para o diretório do MCPServer
cd ../LeadLovers.Api.MCPServer

# Instalar dependências com pnpm
pnpm install

# Verificar se a instalação foi bem-sucedida
pnpm list --depth=0
```

### 3. Configurar Variáveis de Ambiente

#### MCPClient
```bash
# No diretório LeadLovers.Api.MCPClient
cd ../LeadLovers.Api.MCPClient
cp .env.example .env

# Editar arquivo de configuração
# No Windows: notepad .env
# No macOS/Linux: nano .env ou vim .env
```

#### MCPServer
```bash
# No diretório LeadLovers.Api.MCPServer
cd ../LeadLovers.Api.MCPServer
cp .env.example .env

# Editar arquivo de configuração
# No Windows: notepad .env
# No macOS/Linux: nano .env ou vim .env
```

### 4. Configurar os arquivos .env

#### MCPClient (.env)
```bash
# =============================================================================
# CONFIGURAÇÃO DO SERVIDOR
# =============================================================================

# Ambiente de execução (development | production | test)
NODE_ENV=development

# Porta do servidor (padrão: 4444)
PORT=4444

# Versão da aplicação
VERSION=1.0.0

# URLs permitidas para CORS (separadas por vírgula)
# Em desenvolvimento, deixe vazio para permitir todas as origens
DOMAIN_URL=

# =============================================================================
# CONFIGURAÇÃO DE LOGGING
# =============================================================================

# Nível de log (trace | debug | info | warn | error | fatal)
LOG_LEVEL=info

# =============================================================================
# CONFIGURAÇÃO DE AUTENTICAÇÃO
# =============================================================================

# URL do servidor SSO
SSO_API_URL=https://sso.leadlovers.com/

# Chave secreta para JWT (mude para uma chave segura em produção)
API_SECRET=sua_chave_secreta_aqui

# =============================================================================
# CONFIGURAÇÃO DO REDIS (opcional)
# =============================================================================

# URL de conexão com Redis
# REDIS_URL=redis://localhost:6379

# =============================================================================
# CONFIGURAÇÃO DO WEBSOCKET
# =============================================================================

# Timeout de conexão WebSocket (ms)
WS_CONNECTION_TIMEOUT=10000

# Intervalo de ping/pong (ms)
WS_PING_INTERVAL=30000
```

#### MCPServer (.env)
```bash
# =============================================================================
# CONFIGURAÇÃO DO LEADLOVERS
# =============================================================================

# URL da API LeadLovers
LEADLOVERS_API_URL=https://api.leadlovers.com

# Token de autenticação da API
LEADLOVERS_API_TOKEN=seu_token_leadlovers

# =============================================================================
# CONFIGURAÇÃO DE IA
# =============================================================================

# Anthropic Claude API
ANTHROPIC_API_KEY=sua_chave_anthropic
ANTHROPIC_MODEL=claude-3-haiku-20240307

# OpenAI (opcional, para futuras integrações)
# OPENAI_API_KEY=sua_chave_openai

# =============================================================================
# CONFIGURAÇÃO DO BEEFREE
# =============================================================================

# BeeFree Email Builder
BEEFREE_API_URL=https://api.beefree.io
BEEFREE_API_TOKEN=seu_token_beefree

# =============================================================================
# CONFIGURAÇÃO DO MCP
# =============================================================================

# Nome e versão do servidor MCP
MCP_SERVER_NAME=leadlovers-mcp
MCP_SERVER_VERSION=2.2.1

# =============================================================================
# LIMITES E SEGURANÇA
# =============================================================================

# Máximo de operações em lote
MAX_BULK_OPERATIONS=100

# Rate limit (requisições por hora)
RATE_LIMIT=1000
```

## ⚙️ Configurações Detalhadas

### Configuração de Ambiente

#### Desenvolvimento
```bash
NODE_ENV=development
PORT=4444
LOG_LEVEL=debug
DOMAIN_URL=
```

#### Produção
```bash
NODE_ENV=production
PORT=80
LOG_LEVEL=warn
DOMAIN_URL=https://app.leadlovers.com,https://api.leadlovers.com
```

#### Teste
```bash
NODE_ENV=test
PORT=4445
LOG_LEVEL=error
DOMAIN_URL=
```

### Configuração de CORS

#### Desenvolvimento (Permissivo)
```bash
DOMAIN_URL=
# Permite todas as origens (*)
```

#### Produção (Restritivo)
```bash
DOMAIN_URL=https://app.leadlovers.com,https://dashboard.leadlovers.com
# Permite apenas domínios específicos
```

### Configuração de Autenticação

#### SSO (Single Sign-On)
```bash
# URL do servidor SSO LeadLovers
SSO_API_URL=https://sso.leadlovers.com/
```

#### JWT Secret
```bash
# Desenvolvimento/Teste
API_SECRET=TESTE

# Produção (use uma chave forte)
API_SECRET=sua-chave-secreta-complexa-aqui
```

⚠️ **Importante**: Em produção, sempre use uma chave secreta forte e única. Nunca commite a chave real no repositório.

### Configuração de Logs

| Nível | Descrição | Uso Recomendado |
|-------|-----------|------------------|
| `trace` | Logs muito detalhados | Debug avançado |
| `debug` | Logs de debug | Desenvolvimento |
| `info` | Informações gerais | Desenvolvimento/Staging |
| `warn` | Avisos | Produção |
| `error` | Apenas erros | Produção crítica |
| `fatal` | Erros fatais | Sistemas críticos |

## 🧪 Verificação da Instalação

### 1. Verificar Compilação

```bash
# Compilar código TypeScript
npm run build

# Verificar se não há erros de compilação
# Deve criar a pasta 'dist/' com arquivos .js
```

### 2. Executar Linting

```bash
# Executar verificação de código
npm run lint

# Deve executar sem erros
```

### 3. Iniciar em Modo Desenvolvimento

#### Iniciar MCPClient (Terminal 1)
```bash
# No diretório LeadLovers.Api.MCPClient
cd LeadLovers.Api.MCPClient
npm run dev

# Verificar se o servidor iniciou corretamente
# Deve exibir:
# - "Swagger documentation available at /api-docs"
# - "Server running in port: 4444"
```

#### Iniciar MCPServer (Terminal 2)
```bash
# No diretório LeadLovers.Api.MCPServer
cd LeadLovers.Api.MCPServer
pnpm dev

# Verificar se o servidor MCP iniciou corretamente
# Deve exibir:
# - "MCP Server started successfully"
# - "Available tools: 8"
```

### 4. Testar Endpoints

```bash
# Testar endpoint de health check
curl http://localhost:4444/v1/health

# Resposta esperada:
{
  "status": "available",
  "serverInfo": {
    "version": "1.0.0",
    "environment": "development",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "uptime": 30.5
  }
}
```

### 5. Acessar Documentação e Endpoints

Abra o navegador e acesse:

#### MCPClient
- **Health Check**: http://localhost:4444/v1/health
- **Documentação Swagger**: http://localhost:4444/api-docs
- **WebSocket**: ws://localhost:4444

#### MCPServer
- O servidor MCP não possui interface web, ele se comunica via stdio com o MCPClient
- As ferramentas MCP são acessadas através do MCPClient

## 🔧 Resolução de Problemas

### Erro: "Port already in use"

```bash
# Verificar qual processo está usando a porta
# No Windows:
netstat -ano | findstr :4444

# No macOS/Linux:
lsof -i :4444

# Parar o processo ou mudar a porta no .env
PORT=4445
```

### Erro: "Module not found"

```bash
# Limpar cache do npm e reinstalar
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### Erro: "TypeScript compilation failed"

```bash
# Verificar versão do TypeScript
npx tsc --version

# Reinstalar TypeScript
npm install -g typescript@latest
npm install --save-dev typescript@latest
```

### Erro: "Permission denied"

```bash
# No macOS/Linux, pode ser necessário usar sudo
sudo npm install -g typescript

# Ou configurar npm para não usar sudo
npm config set prefix ~/.npm-global
export PATH=~/.npm-global/bin:$PATH
```

## 🐳 Configuração com Docker

### Docker Compose (Recomendado)

```yaml
# docker-compose.yml
version: '3.8'

services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    healthcheck:
      test: ["CMD", "redis-cli", "ping"]
      interval: 30s
      timeout: 10s
      retries: 3

  mcp-client:
    build:
      context: ./LeadLovers.Api.MCPClient
      dockerfile: Dockerfile
    ports:
      - "4444:4444"
    environment:
      - NODE_ENV=production
      - PORT=4444
      - REDIS_URL=redis://redis:6379
    depends_on:
      - redis
    volumes:
      - ./LeadLovers.Api.MCPClient/.env:/app/.env:ro
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4444/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3

  mcp-server:
    build:
      context: ./LeadLovers.Api.MCPServer
      dockerfile: Dockerfile
    environment:
      - NODE_ENV=production
    volumes:
      - ./LeadLovers.Api.MCPServer/.env:/app/.env:ro
    stdin_open: true
    tty: true

volumes:
  redis_data:
```

### Executar com Docker Compose

```bash
# Build e iniciar todos os serviços
docker-compose up -d

# Ver logs
docker-compose logs -f

# Parar serviços
docker-compose down

# Rebuild após mudanças
docker-compose up -d --build
```

## 📝 Configuração do IDE

### Visual Studio Code

Extensões recomendadas (`.vscode/extensions.json`):
```json
{
  "recommendations": [
    "ms-vscode.vscode-typescript-next",
    "esbenp.prettier-vscode",
    "dbaeumer.vscode-eslint",
    "bradlc.vscode-tailwindcss",
    "ms-vscode.vscode-json"
  ]
}
```

Configurações do workspace (`.vscode/settings.json`):
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.preferences.importModuleSpecifier": "relative"
}
```

### Configuração de Debug

Launch configuration (`.vscode/launch.json`):
```json
{
  "version": "0.2.0",
  "configurations": [
    {
      "name": "Debug Server",
      "type": "node",
      "request": "launch",
      "program": "${workspaceFolder}/src/index.ts",
      "runtimeArgs": ["-r", "ts-node/register", "-r", "tsconfig-paths/register"],
      "env": {
        "NODE_ENV": "development"
      },
      "console": "integratedTerminal",
      "internalConsoleOptions": "neverOpen"
    }
  ]
}
```

## 🎯 Próximos Passos

Após a instalação bem-sucedida:

1. **Explore a Documentação**:
   - Swagger UI: http://localhost:4444/api-docs
   - [API Documentation](../docs/API.md)
   - [Architecture](./ARCHITECTURE.md)

2. **Teste as Ferramentas MCP**:
   - Use o WebSocket para enviar comandos
   - Teste criação de leads
   - Experimente geração de email com IA

3. **Configure Integrações**:
   - Obtenha tokens da API LeadLovers
   - Configure chave da Anthropic
   - Setup do BeeFree (opcional)

4. **Contribua**:
   - Leia o [CONTRIBUTING.md](../CONTRIBUTING.md)
   - Verifique issues abertas
   - Submeta pull requests

5. **Deploy em Produção**:
   - Configure variáveis de produção
   - Setup Redis para cache
   - Configure monitoramento

## 🆘 Suporte

Se encontrar problemas durante a instalação:

1. Verifique os [problemas conhecidos](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/issues)
2. Abra uma [nova issue](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/issues/new)
3. Entre em contato: [dev@leadlovers.com](mailto:dev@leadlovers.com)