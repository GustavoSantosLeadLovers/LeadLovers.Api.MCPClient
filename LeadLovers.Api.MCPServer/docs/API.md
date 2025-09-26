# API Documentation - LeadLovers MCP Server

## Visão Geral

Este documento detalha todas as ferramentas MCP disponíveis no LeadLovers MCP Server, incluindo seus parâmetros, respostas e exemplos de uso.

## 📊 Ferramentas de Gestão de Leads

### get_leads

Busca leads com filtros avançados e paginação.

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `MachineCode` | number | Sim | Código da máquina |
| `EmailSequenceCode` | number | Não | Código da sequência de email |
| `SequenceLevelCode` | number | Não | Código do nível da sequência |
| `Page` | number | Não | Página (padrão: 1) |
| `Items` | number | Não | Itens por página (padrão: 20, máx: 100) |

#### Exemplo de Requisição

```json
{
  "tool": "get_leads",
  "arguments": {
    "MachineCode": 12345,
    "EmailSequenceCode": 1,
    "Page": 1,
    "Items": 50
  }
}
```

#### Exemplo de Resposta

```json
{
  "isSuccess": true,
  "data": {
    "Items": [
      {
        "LeadCode": 98765,
        "Name": "João Silva",
        "Email": "joao.silva@example.com",
        "Phone": "+55 11 98765-4321",
        "Score": 85,
        "Status": "active",
        "CreatedAt": "2024-01-15T10:30:00Z",
        "Tags": ["cliente-potencial", "interesse-alto"]
      }
    ],
    "TotalItems": 150,
    "TotalPages": 3,
    "CurrentPage": 1
  }
}
```

### create_lead

Cria um novo lead com validação completa.

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `Name` | string | Sim | Nome completo do lead |
| `Email` | string | Sim | Email válido |
| `Phone` | string | Não | Telefone com DDD |
| `MachineCode` | number | Sim | Código da máquina |
| `EmailSequenceCode` | number | Sim | Código da sequência |
| `SequenceLevelCode` | number | Sim | Código do nível |
| `Tags` | string[] | Não | Array de tags |
| `Score` | number | Não | Score inicial (0-100) |
| `City` | string | Não | Cidade |
| `State` | string | Não | Estado |
| `Company` | string | Não | Empresa |

#### Validações

- Email deve ser válido (formato RFC)
- Score deve estar entre 0 e 100
- Nome deve ter entre 2 e 100 caracteres
- Telefone deve seguir padrão brasileiro se fornecido

#### Exemplo de Requisição

```json
{
  "tool": "create_lead",
  "arguments": {
    "Name": "Maria Santos",
    "Email": "maria.santos@empresa.com",
    "Phone": "+55 21 98765-4321",
    "MachineCode": 12345,
    "EmailSequenceCode": 1,
    "SequenceLevelCode": 1,
    "Tags": ["webinar", "download-ebook"],
    "Score": 75,
    "City": "Rio de Janeiro",
    "State": "RJ",
    "Company": "Empresa XYZ"
  }
}
```

#### Exemplo de Resposta

```json
{
  "isSuccess": true,
  "message": "Lead criado com sucesso",
  "data": {
    "LeadCode": 98766,
    "Name": "Maria Santos",
    "Email": "maria.santos@empresa.com",
    "CreatedAt": "2024-01-20T14:45:00Z"
  }
}
```

### update_lead

Atualiza informações de um lead existente.

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `LeadCode` | number | Sim | Código do lead |
| `Name` | string | Não | Novo nome |
| `Email` | string | Não | Novo email |
| `Phone` | string | Não | Novo telefone |
| `Score` | number | Não | Novo score |
| `Tags` | string[] | Não | Novas tags |
| `Status` | string | Não | Novo status |

#### Exemplo de Requisição

```json
{
  "tool": "update_lead",
  "arguments": {
    "LeadCode": 98766,
    "Score": 90,
    "Tags": ["cliente-vip", "comprou"],
    "Status": "customer"
  }
}
```

### delete_lead

Remove um lead de funis e sequências (não exclui da base).

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `LeadCode` | number | Sim | Código do lead |
| `MachineCode` | number | Sim | Código da máquina |

#### Exemplo de Requisição

```json
{
  "tool": "delete_lead",
  "arguments": {
    "LeadCode": 98766,
    "MachineCode": 12345
  }
}
```

## 🏭 Ferramentas de Gestão de Máquinas

### get_machines

Lista todas as máquinas/funis disponíveis com paginação.

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `page` | number | Não | Página (padrão: 1) |
| `itemsPerPage` | number | Não | Itens por página (padrão: 20, máx: 100) |

#### Exemplo de Requisição

```json
{
  "tool": "get_machines",
  "arguments": {
    "page": 1,
    "itemsPerPage": 10
  }
}
```

#### Exemplo de Resposta

```json
{
  "isSuccess": true,
  "data": {
    "machines": [
      {
        "MachineCode": 12345,
        "Name": "Funil de Vendas Principal",
        "Description": "Funil para captura e conversão de leads",
        "Type": "sales",
        "Status": "active",
        "LeadsCount": 1500,
        "ConversionRate": 15.5,
        "CreatedAt": "2023-06-15T10:00:00Z"
      }
    ],
    "pagination": {
      "total": 25,
      "page": 1,
      "itemsPerPage": 10,
      "totalPages": 3
    }
  }
}
```

### get_machine_details

Obtém informações detalhadas de uma máquina específica.

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `machineCode` | number | Sim | Código da máquina |

#### Exemplo de Requisição

```json
{
  "tool": "get_machine_details",
  "arguments": {
    "machineCode": 12345
  }
}
```

#### Exemplo de Resposta

```json
{
  "isSuccess": true,
  "data": {
    "MachineCode": 12345,
    "Name": "Funil de Vendas Principal",
    "Description": "Funil completo para captura e conversão",
    "Type": "sales",
    "Status": "active",
    "Configuration": {
      "AutomationEnabled": true,
      "ScoringEnabled": true,
      "EmailSequences": 3,
      "TotalLevels": 10
    },
    "Statistics": {
      "TotalLeads": 1500,
      "ActiveLeads": 850,
      "ConvertedLeads": 233,
      "ConversionRate": 15.5,
      "AverageScore": 72
    },
    "Sequences": [
      {
        "Code": 1,
        "Name": "Sequência de Boas-Vindas",
        "Levels": 5
      }
    ]
  }
}
```

## 📧 Ferramentas de Email Marketing

### get_email_sequences

Lista todas as sequências de email de uma máquina.

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `MachineCode` | number | Sim | Código da máquina |

#### Exemplo de Requisição

```json
{
  "tool": "get_email_sequences",
  "arguments": {
    "MachineCode": 12345
  }
}
```

#### Exemplo de Resposta

```json
{
  "isSuccess": true,
  "data": [
    {
      "SequenceCode": 1,
      "Name": "Sequência de Boas-Vindas",
      "Description": "Emails iniciais para novos leads",
      "TotalLevels": 5,
      "Status": "active",
      "Levels": [
        {
          "LevelCode": 1,
          "Name": "Email de Boas-Vindas",
          "DelayDays": 0,
          "Subject": "Bem-vindo ao nosso curso!"
        },
        {
          "LevelCode": 2,
          "Name": "Apresentação do Conteúdo",
          "DelayDays": 1,
          "Subject": "Conheça o que preparamos para você"
        }
      ]
    }
  ]
}
```

### create_email_content

Gera conteúdo de email profissional usando IA (Anthropic Claude) e BeeFree Builder.

#### Parâmetros

| Campo | Tipo | Obrigatório | Descrição |
|-------|------|-------------|-----------|
| `prompt` | string | Sim | Descrição do email desejado |

#### Processo de Geração

1. **Análise do Prompt**: Claude analisa e entende o contexto
2. **Geração de Conteúdo**: IA cria título, subtítulo, corpo e CTA
3. **Formatação BeeFree**: Conversão para template profissional
4. **Validação**: Limpeza e validação do JSON final

#### Exemplo de Requisição

```json
{
  "tool": "create_email_content",
  "arguments": {
    "prompt": "Crie um email promocional para Black Friday de um curso de marketing digital. Destaque 50% de desconto, benefícios do curso e crie urgência mencionando que a oferta é válida apenas por 48 horas."
  }
}
```

#### Exemplo de Resposta

```json
{
  "isSuccess": true,
  "data": {
    "subject": "🎯 Black Friday: 50% OFF no Curso de Marketing Digital",
    "preheader": "Oferta válida apenas por 48 horas!",
    "content": {
      "title": "Black Friday Exclusiva!",
      "subtitle": "50% de Desconto no Curso Completo de Marketing Digital",
      "body": "Esta é a sua chance única de transformar sua carreira...",
      "cta": {
        "text": "GARANTIR MINHA VAGA COM 50% OFF",
        "url": "https://example.com/black-friday"
      }
    },
    "beefreeJson": {
      "// Estrutura completa do template BeeFree": "..."
    },
    "metadata": {
      "generatedAt": "2024-01-20T15:30:00Z",
      "aiModel": "claude-3-haiku-20240307",
      "promptTokens": 150,
      "completionTokens": 450
    }
  }
}
```

## 🔐 Códigos de Erro

| Código | Descrição | Ação Recomendada |
|--------|-----------|------------------|
| 400 | Bad Request - Parâmetros inválidos | Verifique os parâmetros enviados |
| 401 | Unauthorized - Token inválido | Verifique o token de API |
| 403 | Forbidden - Sem permissão | Verifique permissões da conta |
| 404 | Not Found - Recurso não encontrado | Verifique se o código do recurso existe |
| 422 | Unprocessable Entity - Validação falhou | Verifique os dados com os schemas Zod |
| 429 | Too Many Requests - Rate limit | Aguarde antes de nova tentativa |
| 500 | Internal Server Error | Contate o suporte |
| 503 | Service Unavailable | API temporariamente indisponível |

## 📝 Schemas de Validação (Zod)

### Lead Schema

```typescript
const LeadSchema = z.object({
  Name: z.string().min(2).max(100),
  Email: z.string().email(),
  Phone: z.string().regex(/^\+?[1-9]\d{1,14}$/).optional(),
  Score: z.number().min(0).max(100).optional(),
  Tags: z.array(z.string()).optional(),
  MachineCode: z.number().positive(),
  EmailSequenceCode: z.number().positive(),
  SequenceLevelCode: z.number().positive()
});
```

### Pagination Schema

```typescript
const PaginationSchema = z.object({
  page: z.number().min(1).default(1),
  itemsPerPage: z.number().min(1).max(100).default(20)
});
```

## 🚦 Rate Limiting

- **Limite Global**: 1000 requisições por hora
- **Limite por Ferramenta**:
  - `create_lead`: 100/hora
  - `update_lead`: 200/hora
  - `delete_lead`: 50/hora
  - `get_leads`: 300/hora
  - `create_email_content`: 50/hora (devido ao uso de IA)

## 🔄 Webhooks (Planejado)

Eventos que serão suportados:

- `lead.created` - Novo lead criado
- `lead.updated` - Lead atualizado
- `lead.scored` - Score do lead alterado
- `lead.converted` - Lead convertido em cliente
- `email.sent` - Email enviado
- `email.opened` - Email aberto
- `email.clicked` - Link clicado

## 📊 Métricas e Analytics

### Métricas Disponíveis

- Total de leads por máquina
- Taxa de conversão por funil
- Score médio dos leads
- Taxa de abertura de emails
- Taxa de cliques em CTAs

### Exemplo de Resposta de Métricas

```json
{
  "metrics": {
    "period": "2024-01",
    "leads": {
      "total": 1500,
      "new": 350,
      "converted": 45,
      "conversionRate": 12.8
    },
    "emails": {
      "sent": 5000,
      "opened": 2100,
      "clicked": 450,
      "openRate": 42.0,
      "clickRate": 9.0
    }
  }
}
```

## 🔗 Links Úteis

- [Model Context Protocol](https://modelcontextprotocol.io/)
- [Zod Documentation](https://zod.dev/)
- [Anthropic API](https://docs.anthropic.com/)
- [BeeFree API](https://docs.beefree.io/)

---

**Última atualização:** Janeiro 2025 | **Versão:** 2.2.1