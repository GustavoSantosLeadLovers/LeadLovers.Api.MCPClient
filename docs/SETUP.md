# Guia de Instalação e Configuração

## 📋 Pré-requisitos

### Software Necessário

- **Node.js**: versão 20.x ou superior
- **npm**: versão 10.x ou superior (incluso com Node.js)
- **Git**: para clonar o repositório

### Verificação de Pré-requisitos

```bash
# Verificar versão do Node.js
node --version
# Deve retornar v20.x.x ou superior

# Verificar versão do npm
npm --version
# Deve retornar 10.x.x ou superior

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

# Navegue para o diretório
cd LeadLovers.Api.MCPClient
```

### 2. Instalar Dependências

```bash
# Instalar todas as dependências
npm install

# Verificar se a instalação foi bem-sucedida
npm list --depth=0
```

### 3. Configurar Variáveis de Ambiente

```bash
# Copiar arquivo de exemplo
cp .env.example .env

# Editar arquivo de configuração
# No Windows: notepad .env
# No macOS/Linux: nano .env ou vim .env
```

### 4. Configurar o arquivo .env

```bash
# =============================================================================
# CONFIGURAÇÃO DO SERVIDOR
# =============================================================================

# Ambiente de execução (development | production | test)
NODE_ENV=development

# Porta do servidor (padrão: 4444)
PORT=4444

# Versão da aplicação (usado na documentação)
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
# CONFIGURAÇÕES FUTURAS (MCP/IA)
# =============================================================================

# API Key da Anthropic (quando implementado)
# ANTHROPIC_API_KEY=your-api-key-here

# Configurações MCP (quando implementado)  
# MCP_SERVER_URL=
# MCP_AUTH_TOKEN=
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

```bash
# Iniciar servidor de desenvolvimento
npm run dev

# Verificar se o servidor iniciou corretamente
# Deve exibir:
# - "Swagger documentation available at /api-docs"
# - "Server running in port: 4444"
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

### 5. Acessar Documentação

Abra o navegador e acesse:
- **API**: http://localhost:4444/v1/health
- **Documentação Swagger**: http://localhost:4444/api-docs

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

## 🐳 Configuração com Docker (Futuro)

```dockerfile
# Dockerfile (planejado)
FROM node:20-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --only=production

COPY dist/ ./dist/
COPY src/shared/configs/ ./src/shared/configs/

EXPOSE 4444

CMD ["npm", "start"]
```

```yaml
# docker-compose.yml (planejado)
version: '3.8'

services:
  leadlovers-mcp-client:
    build: .
    ports:
      - "4444:4444"
    environment:
      - NODE_ENV=production
      - PORT=4444
    healthcheck:
      test: ["CMD", "curl", "-f", "http://localhost:4444/v1/health"]
      interval: 30s
      timeout: 10s
      retries: 3
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

1. **Explore a Documentação**: Acesse `/api-docs` para conhecer a API
2. **Execute os Testes**: `npm test` (quando implementados)
3. **Contribua**: Leia o [CONTRIBUTING.md](CONTRIBUTING.md)
4. **Deploy**: Consulte o [DEPLOYMENT.md](DEPLOYMENT.md) (futuro)

## 🆘 Suporte

Se encontrar problemas durante a instalação:

1. Verifique os [problemas conhecidos](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/issues)
2. Abra uma [nova issue](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/issues/new)
3. Entre em contato: [dev@leadlovers.com](mailto:dev@leadlovers.com)