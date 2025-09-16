# LeadLovers MCP Integration Platform

<div align="center">

[![Release](https://img.shields.io/github/v/release/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient)](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/releases)
[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![MCP](https://img.shields.io/badge/MCP-Compatible-purple.svg)](https://modelcontextprotocol.io/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

**Plataforma de integração inteligente entre LeadLovers CRM e IA usando Model Context Protocol**

[Documentação](#-documentação) • [Instalação](#-instalação) • [Arquitetura](#-arquitetura) • [API](#-api-reference) • [Contribuir](#-contribuindo)

</div>

## 📋 Visão Geral

Este monorepo contém a solução completa para integração do LeadLovers CRM com capacidades de IA através do Model Context Protocol (MCP). A plataforma permite automação inteligente de processos de CRM usando comandos naturais e processamento avançado com IA.

### 🎯 Principais Funcionalidades

- **🤖 Integração com IA**: Suporte para OpenAI e Claude via MCP
- **🔌 API REST/WebSocket**: Interface completa para comunicação em tempo real
- **🔐 Autenticação SSO**: Integração segura com LeadLovers SSO
- **📊 Gestão de Leads**: CRUD completo e operações em lote
- **🚀 Automação**: Processos inteligentes de scoring e segmentação
- **📈 Analytics**: Métricas e insights em tempo real

## 🏗️ Arquitetura

O projeto segue uma arquitetura de **monorepo** com dois componentes principais:

```
LeadLovers.Api.MCPClient/
├── 📁 LeadLovers.Api.MCPClient   # API Gateway & WebSocket Server
│   ├── src/
│   │   ├── infra/                # Infraestrutura (HTTP, WS, Logs)
│   │   ├── modules/              # Módulos de domínio
│   │   │   ├── identity/         # Autenticação SSO
│   │   │   ├── monitor/          # Health checks
│   │   │   └── prompt/           # Processamento de prompts
│   │   └── shared/               # Recursos compartilhados
│   └── dist/                     # Build de produção
│
└── 📁 LeadLovers.Api.MCPServer   # MCP Server & AI Tools
    ├── src/
    │   ├── server/               # Configuração MCP
    │   ├── tools/                # Ferramentas MCP
    │   │   ├── leads/            # Gestão de leads
    │   │   ├── machines/         # Gestão de máquinas/funis
    │   │   └── email-sequence/   # Sequências de email
    │   ├── services/             # Integrações externas
    │   └── schemas/              # Validação com Zod
    └── dist/                     # Build de produção
```

### 🔄 Fluxo de Dados

```mermaid
graph LR
    A[Cliente] -->|HTTP/WS| B[MCPClient]
    B -->|MCP Protocol| C[MCPServer]
    C -->|API REST| D[LeadLovers CRM]
    C -->|AI Processing| E[OpenAI/Claude]
    B -->|Cache| F[Redis]
```

## 🚀 Instalação

### Pré-requisitos

- Node.js 20.x ou superior
- npm 10.x ou pnpm 10.x
- Redis (para cache de sessões)
- Conta LeadLovers com API token

### Setup Rápido

1. **Clone o repositório**
```bash
git clone https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient.git
cd LeadLovers.Api.MCPClient
```

2. **Configure as variáveis de ambiente**

Para o **MCPClient**:
```bash
cd LeadLovers.Api.MCPClient
cp .env.example .env
# Edite .env com suas configurações
```

Para o **MCPServer**:
```bash
cd ../LeadLovers.Api.MCPServer
cp .env.example .env
# Configure tokens de API e credenciais
```

3. **Instale as dependências**

MCPClient:
```bash
cd LeadLovers.Api.MCPClient
npm install
```

MCPServer:
```bash
cd ../LeadLovers.Api.MCPServer
pnpm install  # Este projeto usa pnpm
```

4. **Execute em desenvolvimento**

Terminal 1 - MCPClient:
```bash
cd LeadLovers.Api.MCPClient
npm run dev
```

Terminal 2 - MCPServer:
```bash
cd LeadLovers.Api.MCPServer
pnpm dev
```

5. **Acesse a aplicação**
- API REST: http://localhost:4444/v1
- Documentação Swagger: http://localhost:4444/api-docs
- WebSocket: ws://localhost:4444

## 📖 Documentação

### MCPClient - API Gateway

- [Arquitetura](./LeadLovers.Api.MCPClient/docs/ARCHITECTURE.md)
- [WebSocket](./LeadLovers.Api.MCPClient/docs/WEBSOCKET.md)
- [Desenvolvimento](./LeadLovers.Api.MCPClient/docs/DEVELOPMENT.md)
- [Setup](./LeadLovers.Api.MCPClient/docs/SETUP.md)

### MCPServer - MCP Tools

- [Claude Guide](./LeadLovers.Api.MCPServer/CLAUDE.md)
- [Ferramentas MCP](./LeadLovers.Api.MCPServer/docs/TOOLS.md)

## 🔌 API Reference

### REST Endpoints

#### Autenticação
```http
POST /v1/sessions
Content-Type: application/json

{
  "token": "sso_token",
  "refreshToken": "refresh_token"
}
```

#### Health Check
```http
GET /v1/health
```

### WebSocket Events

#### Conexão
```javascript
const socket = io('http://localhost:4444', {
  auth: {
    token: 'seu_jwt_token'
  }
});
```

#### Envio de Prompt
```javascript
socket.emit('send-prompt', {
  prompt: 'Crie um lead chamado João Silva'
});

socket.on('prompt-response', (response) => {
  console.log('Resposta:', response);
});
```

### MCP Tools

#### Criar Lead
```javascript
{
  "tool": "create_lead",
  "arguments": {
    "Name": "João Silva",
    "Email": "joao@example.com",
    "MachineCode": 12345,
    "EmailSequenceCode": 1,
    "SequenceLevelCode": 1
  }
}
```

#### Buscar Máquinas
```javascript
{
  "tool": "get_machines",
  "arguments": {
    "page": 1,
    "itemsPerPage": 20
  }
}
```

## 🧪 Testes

### MCPClient
```bash
cd LeadLovers.Api.MCPClient
npm test          # Testes unitários
npm run test:e2e  # Testes end-to-end
```

### MCPServer
```bash
cd LeadLovers.Api.MCPServer
pnpm test         # Testes unitários
pnpm coverage     # Coverage report
```

## 📦 Build & Deploy

### Build de Produção

```bash
# MCPClient
cd LeadLovers.Api.MCPClient
npm run build

# MCPServer
cd ../LeadLovers.Api.MCPServer
pnpm build
```

### Docker

```bash
# Usando docker-compose
docker-compose up -d

# Build manual
docker build -t leadlovers-mcpclient ./LeadLovers.Api.MCPClient
docker build -t leadlovers-mcpserver ./LeadLovers.Api.MCPServer
```

### Variáveis de Ambiente

#### MCPClient (.env)
```env
# Server
NODE_ENV=production
PORT=4444

# Auth
SSO_API_URL=https://sso.leadlovers.com
API_SECRET=your_secret_key

# Redis
REDIS_URL=redis://localhost:6379

# CORS
DOMAIN_URL=https://app.leadlovers.com
```

#### MCPServer (.env)
```env
# LeadLovers API
LEADLOVERS_API_URL=https://app.leadlovers.com
LEADLOVERS_API_TOKEN=your_token

# AI Services
OPENAI_API_KEY=your_openai_key
ANTHROPIC_API_KEY=your_claude_key

# MCP
MCP_SERVER_NAME=leadlovers-mcp
MCP_SERVER_VERSION=2.0.0
```

## 🔄 CI/CD

O projeto utiliza GitHub Actions para automação:

- **Release Management**: Versionamento automático com Semantic Versioning
- **Conventional Commits**: Geração automática de CHANGELOG
- **Quality Gates**: Lint e build obrigatórios antes do release

### Workflow de Release

1. Faça commits seguindo [Conventional Commits](https://www.conventionalcommits.org/)
2. Abra PR para `main`
3. Após merge, o workflow cria release automaticamente

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feat/amazing-feature`)
3. Commit usando conventional commits (`git commit -m 'feat: add amazing feature'`)
4. Push para a branch (`git push origin feat/amazing-feature`)
5. Abra um Pull Request

### Padrões de Código

- **TypeScript**: Use tipos explícitos
- **Clean Architecture**: Mantenha separação de camadas
- **Tests**: Escreva testes para novas funcionalidades
- **Docs**: Atualize documentação quando necessário

## 📊 Status do Projeto

- ✅ Infraestrutura base completa
- ✅ Autenticação SSO implementada
- ✅ WebSocket com Redis
- ✅ Ferramentas MCP básicas
- ⏳ Integração completa Client ↔ Server
- ⏳ Processamento com IA (OpenAI/Claude)
- 📋 Scoring inteligente de leads
- 📋 Dashboard analytics

## 🛡️ Segurança

- Autenticação JWT obrigatória
- Rate limiting implementado
- Validação de entrada com Zod
- CORS configurável por ambiente
- Secrets via environment variables

## 📄 Licença

Este projeto está licenciado sob a licença ISC - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Equipe

- **Gustavo Santos** - Lead Developer - [GitHub](https://github.com/GustavoSantosLeadLovers)

## 🙏 Agradecimentos

- [LeadLovers](https://leadlovers.com) pela plataforma CRM
- [Anthropic](https://anthropic.com) pelo Model Context Protocol
- [OpenAI](https://openai.com) pela API de IA

---

<div align="center">

**[⬆ Voltar ao topo](#leadlovers-mcp-integration-platform)**

Feito com ❤️ pela equipe LeadLovers

</div>