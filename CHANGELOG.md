# Changelog

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