# Changelog

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