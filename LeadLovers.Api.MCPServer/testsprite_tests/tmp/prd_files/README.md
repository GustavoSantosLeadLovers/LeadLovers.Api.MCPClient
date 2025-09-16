# 🤖 LeadLovers MCP Server

> **AI-First CRM Integration** - Servidor MCP que adiciona superpoderes de IA ao LeadLovers CRM através de comandos em linguagem natural.

## 🚀 Quick Start

### 1. Instalação

```bash
# Clone e instale dependências
pnpm install

# Configure ambiente
cp .env.example .env
# Edite o .env com suas credenciais
```

### 2. Configuração

Configure as variáveis essenciais no `.env`:

```env
# LeadLovers API
LEADLOVERS_API_URL=https://api.leadlovers.com
LEADLOVERS_API_TOKEN=seu_token_aqui

# OpenAI
OPENAI_API_KEY=sua_chave_openai_aqui

# Ambiente
NODE_ENV=development
```

### 3. Desenvolvimento

```bash
# Iniciar servidor com hot reload
pnpm dev

# Em outra aba, testar build
pnpm build

# Verificar tipos e lint
pnpm type-check
pnpm lint
```

## 🛠️ Funcionalidades Implementadas

### ✅ Gerenciamento de Leads
- **create_lead** - Criar novos leads com validação completa
- **search_leads** - Busca avançada com filtros inteligentes

### ✅ Gerenciamento de Máquinas
- **get_machines** - Listar todas as máquinas da conta com paginação
- **get_machine_details** - Obter detalhes específicos de uma máquina

### ✅ Sequências de E-mail
- **get_email_sequences** - Obter lista de sequências de e-mail por máquina

### 🔄 Em Desenvolvimento
- **score_lead** - Score de IA baseado em métricas
- **move_lead** - Mover leads no pipeline
- **bulk_operations** - Operações em massa seguras

## 🧠 Como Funciona

O servidor MCP atua como uma ponte inteligente entre IA e CRM:

```
Claude/ChatGPT → MCP Server → LeadLovers API
     ↑                ↓
Linguagem Natural → Ações Estruturadas
```

### Exemplos de Uso

```
👤 "Crie um lead para João Silva da TechCorp, email joao@techcorp.com"
🤖 MCP processa:
   1. Valida dados com Zod
   2. Chama LeadLovers API
   3. Retorna confirmação estruturada

👤 "Liste todas as máquinas da minha conta"
🤖 MCP processa:
   1. Chama get_machines
   2. Retorna lista paginada com códigos e estatísticas
   3. Mostra leads e views por máquina

👤 "Mostre as sequências de e-mail da máquina 12345"
🤖 MCP processa:
   1. Valida código da máquina
   2. Chama get_email_sequences
   3. Lista sequências disponíveis com códigos
```

## 📁 Estrutura do Projeto

```
src/
├── server/          # Configuração do servidor MCP
│   ├── index.ts     # Servidor principal
│   └── config.ts    # Validação de configuração
├── tools/           # Ferramentas MCP organizadas
│   ├── leads/       # Operações de leads
│   ├── machines/    # Operações de máquinas
│   ├── email-sequence/ # Operações de sequências de e-mail
│   └── pipeline/    # Operações de pipeline
├── services/        # Integrações externas
│   └── leadlovers-api.ts  # Cliente LeadLovers
├── schemas/         # Validação Zod
└── types/          # Tipos TypeScript
```

## 🔒 Segurança e Validação

- ✅ **Validação rigorosa** com Zod schemas
- ✅ **Rate limiting** configurável
- ✅ **Logs de auditoria** completos
- ✅ **Permissões granulares**
- ✅ **Sanitização de dados**

## 🧪 Testes

```bash
# Executar testes
pnpm test

# Testes com watch mode
pnpm test:watch

# Cobertura
pnpm test --coverage
```

## 📊 Monitoramento

O servidor inclui logs estruturados:

```
[MCP Server] Starting leadlovers-mcp v1.0.0
[MCP Server] Environment: development
[LeadLovers API] GET /leads - 200
[Create Lead] Lead created: ID 12345
```

## 🔗 Integração com IA

### Claude Desktop
Adicione no `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "leadlovers": {
      "command": "node",
      "args": ["./dist/server/index.js"],
      "cwd": "/path/to/Leadlovers.MCP"
    }
  }
}
```

### ChatGPT (futuro)
Suporte via OpenAI Custom GPTs será adicionado.

## 🚀 Roadmap

### Sprint 1-2 (Concluído)
- ✅ Setup completo da infraestrutura
- ✅ Servidor MCP básico funcionando
- ✅ Integração LeadLovers API
- ✅ Ferramentas de lead (criar/buscar)
- ✅ Gerenciamento de máquinas (listar/detalhes)
- ✅ Sequências de e-mail (listar por máquina)

### Sprint 3-4 (Próximo)
- 🔄 Score inteligente de leads
- 🔄 Operações de pipeline
- 🔄 Sistema de tarefas
- 🔄 Validação de segurança avançada

### Sprint 5-6 (Futuro)
- ⏳ Follow-up automático
- ⏳ Análises preditivas
- ⏳ Assistente de conteúdo
- ⏳ Dashboard executivo

## 💡 Contribuição

1. Fork o projeto
2. Crie uma branch: `git checkout -b feature/nova-funcionalidade`
3. Implemente seguindo os padrões:
   - TypeScript rigoroso
   - Validação Zod
   - Testes unitários
   - Documentação atualizada
4. Commit: `git commit -m 'feat: adiciona nova funcionalidade'`
5. Push: `git push origin feature/nova-funcionalidade`
6. Abra um PR

## 📞 Suporte

- **Documentação**: Veja [CLAUDE.md](./CLAUDE.md) para detalhes técnicos
- **Estratégia**: Consulte [TODO.md](./TODO.md) para visão geral
- **Issues**: Relate problemas via GitHub Issues

---

**⚡ Objetivo**: Transformar o LeadLovers no CRM mais inteligente do mercado através de IA nativa e contextual via MCP.