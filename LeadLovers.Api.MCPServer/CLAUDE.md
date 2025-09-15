# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Leadlovers.MCP** is a Model Context Protocol (MCP) server that integrates AI capabilities with LeadLovers CRM. It provides intelligent automation for lead management, scoring, pipeline operations, and follow-up suggestions through natural language commands.

The project implements the strategy outlined in TODO.md - an IA-First approach that adds AI as a "superpower" layer over existing CRM operations.

## Technology Stack

- **TypeScript** - Type-safe development
- **Node.js 18+** - Runtime environment  
- **Zod** - Schema validation
- **@modelcontextprotocol/sdk** - Official MCP SDK
- **axios** - HTTP client for LeadLovers API integration

## Package Management

This project uses **pnpm** (version 10.15.1).

### Essential Commands

```bash
# Install dependencies
pnpm install

# Development with hot reload
pnpm dev

# Build TypeScript to JavaScript
pnpm build

# Start production server
pnpm start

# Run tests
pnpm test
pnpm test:watch

# Code quality
pnpm lint
pnpm lint:fix
pnpm type-check
```

## Environment Configuration

1. Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```

2. Configure required environment variables:
- `LEADLOVERS_API_URL` - LeadLovers API endpoint
- `LEADLOVERS_API_TOKEN` - API authentication token
- `OPENAI_API_KEY` - OpenAI API key for AI features
- `ANTHROPIC_API_KEY` - Claude API key (optional)

## Project Structure

```
src/
├── server/           # MCP server configuration
├── tools/           # MCP tools (leads, pipeline, etc.)
├── services/        # External API integrations
├── schemas/         # Zod validation schemas  
├── types/          # TypeScript type definitions
tests/              # Test files
```

## MCP Tools Available

### Lead Management
- `create_lead` - Create new leads with validation
- `search_leads` - Advanced lead search with filters
- `score_lead` - AI-powered lead scoring (planned)

### Machine Management
- `get_machines` - List all machines in LeadLovers account with pagination
- `get_machine_details` - Get detailed information about a specific machine

### Email Sequence Management
- `get_email_sequences` - Get list of email sequences for a specific machine

### Pipeline Operations (Planned)
- `move_lead` - Move leads through pipeline stages
- `bulk_move_leads` - Bulk pipeline operations
- `get_pipeline_status` - Pipeline analytics

## Architecture Principles

### Security First
- All inputs validated with Zod schemas
- Rate limiting and bulk operation controls
- Granular permission system
- Complete audit trail

### AI Integration
- Multi-model AI orchestration (OpenAI + Claude)
- Contextual understanding of CRM data
- Natural language command interpretation
- Intelligent automation suggestions

### LeadLovers Integration
- RESTful API client with error handling
- Comprehensive CRM operation support
- Metrics and analytics integration
- Real-time data synchronization

## Development Workflow

1. **Setup**: Install dependencies and configure environment
2. **Development**: Use `pnpm dev` for hot reload development
3. **Testing**: Write tests for new tools and services
4. **Build**: TypeScript compilation with `pnpm build`
5. **Quality**: Run linting and type checking before commits

## Common Tasks

### Adding New MCP Tools
1. Create tool definition in `src/tools/[category]/[tool-name].ts`
2. Implement execution function with proper validation
3. Register tool in `src/server/index.ts`
4. Add appropriate schemas in `src/schemas/`
5. Update both CLAUDE.md and README.md with new tool documentation

### Extending LeadLovers Integration
1. Add new methods to `src/services/leadlovers-api.ts`
2. Define TypeScript interfaces in `src/types/leadlovers.ts`
3. Create validation schemas in `src/schemas/`

### AI Model Integration
- Configure AI services in `src/services/`
- Use structured prompts for consistent AI responses
- Implement proper error handling and fallbacks

## Testing Strategy

- Unit tests for individual tools and services
- Integration tests for LeadLovers API calls
- Mock external dependencies for reliable testing
- Test AI prompt engineering and response parsing

## Deployment Considerations

- MCP servers typically run as stdio processes
- Environment variables for production configuration
- Proper logging and monitoring setup
- Error reporting and recovery mechanisms