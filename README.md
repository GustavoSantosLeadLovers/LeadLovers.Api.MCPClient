# LeadLovers MCP Client API

> 🚀 API do cliente MCP (Model Context Protocol) da LeadLovers para integração com serviços de IA

[![Node.js](https://img.shields.io/badge/Node.js-20.x-green.svg)](https://nodejs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.9-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-5.1-lightgrey.svg)](https://expressjs.com/)
[![License: ISC](https://img.shields.io/badge/License-ISC-yellow.svg)](https://opensource.org/licenses/ISC)

## 📋 Sobre o Projeto

O LeadLovers MCP Client é uma API REST desenvolvida em Node.js e TypeScript que serve como cliente para o Model Context Protocol (MCP). Esta aplicação fornece uma interface HTTP para integração com serviços de IA, permitindo comunicação estruturada e tipada.

### ✨ Funcionalidades

- 🔍 **Health Check**: Monitoramento da saúde da aplicação
- 📚 **Documentação Swagger**: Interface interativa para explorar a API
- 🛡️ **Graceful Shutdown**: Encerramento controlado do servidor
- 📝 **Logs Estruturados**: Sistema de logging com Pino
- 🔧 **Configuração Flexível**: Suporte a múltiplos ambientes
- 🚦 **CORS Configurável**: Política de CORS adaptável por ambiente

## 🛠️ Tecnologias Utilizadas

### Core
- **[Node.js](https://nodejs.org/)** - Runtime JavaScript
- **[TypeScript](https://www.typescriptlang.org/)** - Tipagem estática
- **[Express.js](https://expressjs.com/)** - Framework web

### Documentação
- **[Swagger/OpenAPI 3.0](https://swagger.io/)** - Documentação de API
- **[swagger-jsdoc](https://github.com/Surnet/swagger-jsdoc)** - Geração de specs
- **[swagger-ui-express](https://github.com/scottie1984/swagger-ui-express)** - Interface web

### Qualidade e Padronização
- **[ESLint](https://eslint.org/)** - Linting de código
- **[Prettier](https://prettier.io/)** - Formatação de código
- **[Husky](https://typicode.github.io/husky/)** - Git hooks
- **[lint-staged](https://github.com/okonet/lint-staged)** - Lint apenas arquivos modificados

### Logging e Monitoramento
- **[Pino](https://getpino.io/)** - Logger de alta performance
- **[Zod](https://zod.dev/)** - Validação de schema

### Integração MCP
- **[@modelcontextprotocol/sdk](https://www.npmjs.com/package/@modelcontextprotocol/sdk)** - SDK oficial MCP
- **[@anthropic-ai/sdk](https://www.npmjs.com/package/@anthropic-ai/sdk)** - SDK da Anthropic

## 🚀 Início Rápido

### Pré-requisitos

- Node.js 20.x ou superior
- npm 10.x ou superior

### Instalação

1. **Clone o repositório**
   ```bash
   git clone https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient.git
   cd LeadLovers.Api.MCPClient
   ```

2. **Instale as dependências**
   ```bash
   npm install
   ```

3. **Configure as variáveis de ambiente**
   ```bash
   cp .env.example .env
   # Edite o arquivo .env com suas configurações
   ```

4. **Execute em modo desenvolvimento**
   ```bash
   npm run dev
   ```

5. **Acesse a aplicação**
   - API: http://localhost:4444/v1
   - Documentação: http://localhost:4444/api-docs
   - Health Check: http://localhost:4444/v1/health

## ⚙️ Scripts Disponíveis

```bash
# Desenvolvimento
npm run dev          # Inicia servidor em modo desenvolvimento com hot-reload

# Build e Produção  
npm run build        # Compila TypeScript para JavaScript
npm start            # Executa aplicação compilada

# Qualidade de Código
npm run lint         # Executa ESLint com correção automática
npm run prettier     # Formata código com Prettier

# Utilitários
npm run validate-branch-name  # Valida nome da branch atual

# Release Management
npm run release:generate      # Gera nova versão automaticamente
npm run release:patch         # Força release patch (x.x.X)
npm run release:minor         # Força release minor (x.X.x)
npm run release:major         # Força release major (X.x.x)
npm run release:dry-run       # Simula release sem executar
npm run release:first         # Primeira release do projeto
```

## 🌐 Variáveis de Ambiente

```bash
# Servidor
NODE_ENV=development        # Ambiente: development | production
PORT=4444                  # Porta do servidor
VERSION=1                  # Versão da aplicação
DOMAIN_URL=                # URLs permitidas para CORS (separadas por vírgula)

# Logger
LOG_LEVEL=info             # Nível de log: trace | debug | info | warn | error
```

## 📚 Documentação da API

### Swagger UI
A documentação interativa está disponível em modo desenvolvimento:
- **URL**: http://localhost:4444/api-docs
- **Recursos**: Teste de endpoints, exemplos e schemas

### Endpoints Principais

#### Health Check
```http
GET /v1/health
```

**Resposta (200 OK)**:
```json
{
  "status": "available",
  "serverInfo": {
    "version": "1",
    "environment": "development",
    "timestamp": "2025-01-15T10:30:00.000Z",
    "uptime": 3600.5
  }
}
```

## 🏗️ Arquitetura do Projeto

```
src/
├── infra/                  # Infraestrutura
│   ├── http/              # Configuração HTTP
│   │   ├── routes/        # Definição de rotas
│   │   └── server.ts      # Configuração do Express
│   ├── logger/            # Sistema de logs
│   └── swagger/           # Documentação API
├── modules/               # Módulos de domínio
│   └── monitor/           # Módulo de monitoramento
│       └── presentation/  # Camada de apresentação
├── shared/                # Recursos compartilhados
│   ├── configs/           # Configurações
│   └── utils/             # Utilitários
└── index.ts               # Ponto de entrada
```

### Padrões Arquiteturais

- **Clean Architecture**: Separação clara de responsabilidades
- **Dependency Injection**: Inversão de dependências
- **DTOs**: Objetos de transferência de dados tipados
- **Handler Pattern**: Manipuladores de requisição isolados

## 🔧 Configuração de Desenvolvimento

### Git Hooks
O projeto usa Husky para automatizar verificações:
- **pre-commit**: Executa lint e prettier nos arquivos modificados
- **Validação de Branch**: Nomes devem seguir padrão (feat/, fix/, etc.)

### Padrões de Branch
```
feat/nova-funcionalidade     # Nova funcionalidade
fix/correcao-bug            # Correção de bug
docs/atualizacao-doc        # Documentação
chore/configuracao          # Configuração/manutenção
refactor/reestruturacao     # Refatoração
```

## 🧪 Testes

> ⚠️ **Em desenvolvimento**: Sistema de testes será implementado

## 📦 Build e Deploy

### Build para Produção
```bash
npm run build
```

### Execução em Produção
```bash
# Usando npm
npm start

# Usando PM2 (recomendado)
pm2 start dist/index.js --name leadlovers-mcp-client
```

## 🚀 Release Management

O projeto utiliza automação completa para gestão de releases com base em [Conventional Commits](https://www.conventionalcommits.org/) e [Semantic Versioning](https://semver.org/).

### 📋 Processo Automático

Quando uma PR é mergeada na branch principal, o sistema automaticamente:

1. **Analisa commits** desde a última release
2. **Determina o tipo de versão** (patch/minor/major)
3. **Atualiza package.json** com nova versão
4. **Gera CHANGELOG.md** com as mudanças
5. **Cria tag Git** com a versão
6. **Publica GitHub Release** com notas

### 🏷️ Conventional Commits

Use os prefixos padrão nos commits:

- `feat:` - Nova funcionalidade (minor)
- `fix:` - Correção de bug (patch)
- `perf:` - Melhoria de performance (patch)
- `refactor:` - Refatoração (patch)
- `docs:` - Documentação (patch)
- `chore:` - Manutenção (patch)
- `BREAKING CHANGE:` - Mudança incompatível (major)

### 🎯 Release Manual

```bash
# Gerar versão automaticamente
npm run release:generate

# Forçar tipo específico
npm run release:patch   # 1.0.0 → 1.0.1
npm run release:minor   # 1.0.0 → 1.1.0
npm run release:major   # 1.0.0 → 2.0.0

# Simular sem executar
npm run release:dry-run
```

### 📈 Versionamento Semântico

- **MAJOR** (X.y.z) - Mudanças incompatíveis na API
- **MINOR** (x.Y.z) - Novas funcionalidades compatíveis
- **PATCH** (x.y.Z) - Correções de bugs compatíveis

## 🤝 Contribuindo

1. Fork o projeto
2. Crie uma branch seguindo os padrões: `git checkout -b feat/nova-funcionalidade`
3. Commit suas mudanças: `git commit -m 'feat: adiciona nova funcionalidade'`
4. Push para a branch: `git push origin feat/nova-funcionalidade`
5. Abra um Pull Request

### Diretrizes
- Siga os padrões de código (ESLint/Prettier)
- Documente novas funcionalidades
- Adicione testes quando aplicável
- Mantenha commits semânticos

## 📄 Licença

Este projeto está licenciado sob a Licença ISC - veja o arquivo [LICENSE](LICENSE) para detalhes.

## 👥 Time de Desenvolvimento

- **LeadLovers Development Team** - [dev@leadlovers.com](mailto:dev@leadlovers.com)

## 🔗 Links Úteis

- [Documentação MCP](https://modelcontextprotocol.io/)
- [Anthropic SDK](https://github.com/anthropics/anthropic-sdk-typescript)
- [Express.js Docs](https://expressjs.com/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)

---

**Desenvolvido com ❤️ pela equipe LeadLovers**