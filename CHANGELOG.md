# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.3.0](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/compare/v1.2.0...v1.3.0) (2025-09-15)


### 🚀 Features

* implement identity module with SSO integration ([bb81b14](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/bb81b141c368c8381d20f5b3d4592dd56624e3bf))


### 📚 Documentation

* add comprehensive Swagger documentation for identity module ([87adb0c](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/87adb0c7025f21b7c938e7b67dcbf225a10be8c6))

## [1.2.0](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/compare/v1.1.0...v1.2.0) (2025-09-14)


### 🚀 Features

* add automated branch cleanup script ([4164226](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/4164226611d0b9a26980dfb0053a6457d65fb5e1))


### 🐛 Bug Fixes

* improve error handling in branch cleanup script ([a04a973](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/a04a973d4de550569ac4028200aee26f4e1709b4))

## 1.1.0 (2025-09-13)


### 📚 Documentation

* add comprehensive project documentation ([d8f332c](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/d8f332c15434b8d37a8012c879b26594e6f4bd3c))


### 🔧 Maintenance

* update environment variables example file ([b076091](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/b076091a064799eb9eae428d7e6360ea10b621f8))


### 🚀 Features

* add Swagger/OpenAPI dependencies for API documentation ([46e5a13](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/46e5a1363ed9e979a238bedf4acfdb9c52f7f671))
* configure project dependencies and scripts ([f06d677](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/f06d677c897e0d07931ca46322bc855d43dbe339))
* cria estrutura inicial do projeto ([c973670](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/c973670337e291a088a3e910d88781253b9abd24))
* expand allowed branch name patterns and exempt branches ([11e008c](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/11e008cd4c4d711169655c24259c6623d64561d3))
* implement automated release management system ([a071126](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/a071126adf9c194678d4eafa613d2e5954d90d56))
* implement graceful shutdown for server ([e6316ae](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/e6316ae8ad150d178e51a7b81a8a610acbd19f6e))
* implement MCP client HTTP server infrastructure ([a0e01fc](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/a0e01fc93a069bebf860c850e59df35691722e58))
* implement Swagger/OpenAPI configuration ([848ce4b](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/848ce4b1328dfb83c5349cbec742c93a7f0aed1a))
* integrate Swagger UI with Express server and document endpoints ([75e8a1e](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/commit/75e8a1e118e0a8164c1df731227b0972e31ea756))

## [1.0.0] - 2025-01-15

### Added
- Health check endpoint (`GET /v1/health`) with comprehensive server monitoring
  - Returns application status, version, environment, timestamp, and uptime
  - Structured response with Zod validation
- Swagger/OpenAPI 3.0 documentation with interactive UI
  - Available at `/api-docs` in development environment
  - Complete API specification with schemas and examples
  - Automatic documentation generation from JSDoc annotations
- Graceful shutdown mechanism with configurable timeout (10 seconds)
  - Proper cleanup of HTTP connections and resources
  - Process signal handling (SIGTERM, SIGINT)
- Structured logging system with Pino
  - JSON logs in production, pretty-print in development
  - Configurable log levels and contextual information
- CORS configuration with environment-based policies
  - Permissive settings for development
  - Restrictive whitelist for production domains
- Express.js server with TypeScript and Clean Architecture
  - Modular structure with clear separation of concerns
  - Dependency injection and inversion of control
- Comprehensive project documentation
  - Complete README.md with installation and usage instructions
  - Detailed architecture documentation with design decisions
  - Development workflow and contribution guidelines
  - Setup instructions with troubleshooting guide

### Security
- Environment variable validation and type safety
- CORS protection with configurable domain restrictions
- Input validation with Zod schemas
- Structured error handling without information leakage

### Infrastructure
- TypeScript configuration with strict mode enabled
- ESLint and Prettier for code quality and consistency
- Husky pre-commit hooks with lint-staged
- Branch name validation following conventional patterns
- Package management with npm and lock file integrity

### Documentation
- Interactive API documentation with Swagger UI
- Comprehensive README with badges and quick start guide
- Architecture documentation following Clean Architecture principles
- Development workflow with git conventions and code standards
- Contribution guidelines with templates and review process
- Setup guide with environment configuration examples

---

## Release Notes Format

Each release includes:
- **Added**: New features and capabilities
- **Changed**: Changes in existing functionality
- **Deprecated**: Soon-to-be removed features
- **Removed**: Removed features
- **Fixed**: Bug fixes
- **Security**: Security-related changes

## Versioning Strategy

This project follows [Semantic Versioning](https://semver.org/):
- **MAJOR** version for incompatible API changes
- **MINOR** version for backward-compatible functionality additions
- **PATCH** version for backward-compatible bug fixes

## Links

- [Project Repository](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient)
- [Documentation](docs/README.md)
- [Contributing Guidelines](CONTRIBUTING.md)