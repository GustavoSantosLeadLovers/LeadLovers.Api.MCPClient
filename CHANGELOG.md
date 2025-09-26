# Changelog

All notable changes to this project will be documented in this file.

## [v2.2.2] - 2025-09-26

### Changes



All notable changes to this project will be documented in this file.

## [v2.2.1] - 2025-09-26

### Changes

#### Bug Fixes
- fix: melhoria na validação e limpeza de respostas JSON da API Anthropic (9625cd5)



All notable changes to this project will be documented in this file.

## [v2.2.0] - 2025-09-26

### Changes

#### Features
- Merge pull request #13 from GustavoSantosLeadLovers/feature/email-marketing (3295356)



All notable changes to this project will be documented in this file.

## [Unreleased]

### Added
- feat: implementação da tool `create_email_content` para geração de conteúdo de email marketing com IA
- feat: integração com Anthropic Claude API para processamento de linguagem natural
- feat: integração com BeeFree Email Builder para criação de templates visuais
- feat: módulo completo de Email Marketing com arquitetura Clean Architecture (domain, application, presentation)
- feat: providers AIAPI e BuilderProvider para abstrair integrações externas

### Changed
- refactor: reorganização da estrutura de pastas, movendo serviços para shared/providers
- refactor: remoção das pastas services e schemas do nível raiz
- refactor: centralização de configurações em shared/configs

## [v2.1.0] - 2025-09-24

### Changes

#### Features
- feat: add bee free authenticate endpoint (cfcee8e)
- Merge pull request #11 from GustavoSantosLeadLovers/feat/add-mcp-client (c2225bd)
- feat: expand MCP server with complete CRUD operations and email sequences (35d7129)
- feat: add OpenAI dependency and simplify prompt handler response (29a5998)
- feat: implement service layer architecture and improve MCP client handling (81830cb)
- feat: enhance MCP integration with improved configurations and service structure (6bc09b1)
- feat: adicionar integração com MCP Client usando OpenAI (89815a8)



All notable changes to this project will be documented in this file.

## [v2.0.1] - 2025-09-16

### Changes



All notable changes to this project will be documented in this file.

## [v2.0.0] - 2025-09-16

### Changes

#### Features
- Merge pull request #9 from GustavoSantosLeadLovers/feat/configure-github-actions-monorepo (e7dad0e)
- feat: configurar GitHub Actions para estrutura monorepo (af9b8d4)
- Merge pull request #8 from GustavoSantosLeadLovers/feat/add-websocket (f2dbc4d)
- feat: implement WebSocket server with Socket.IO integration (6260ab0)
- Merge pull request #6 from GustavoSantosLeadLovers/feat/MCPServer (b0a6271)
- feat: adding MCP server to the project (285f76d)

#### Bug Fixes
- fix: corrigir encoding de caracteres e adicionar configuração de autenticação (de6bfa4)
- fix: improve WebSocket implementation and add comprehensive documentation (615e406)
- Merge pull request #7 from GustavoSantosLeadLovers/fix/building (6589a7f)
- fix: fixing build and adding tsconfig (3e4c914)
- fix: fixing test (9c87415)



All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Initial monorepo setup with MCPClient and MCPServer
- GitHub Actions workflow for automated releases
- WebSocket server with authentication (MCPClient)
- MCP tools for LeadLovers CRM integration (MCPServer)
- Redis integration for session management
- SSO authentication support

### Changed
- Moved GitHub Actions to repository root for monorepo support
- Updated release workflow to handle both projects

### Fixed
- GitHub Actions detection in monorepo structure