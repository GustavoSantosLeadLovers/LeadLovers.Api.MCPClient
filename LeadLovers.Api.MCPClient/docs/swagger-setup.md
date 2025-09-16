# Swagger Documentation Setup

## 📋 Resumo

A documentação da API do LeadLovers MCP Client foi implementada usando Swagger/OpenAPI 3.0. A documentação interativa está disponível apenas no ambiente de desenvolvimento.

## 🚀 Como Acessar

1. **Inicie o servidor de desenvolvimento:**
   ```bash
   npm run dev
   ```

2. **Acesse a documentação:**
   - URL: `http://localhost:4444/api-docs`
   - A documentação estará disponível através da interface do Swagger UI

## 📖 Funcionalidades

### Interface Swagger UI
- **Explorador de APIs**: Navegue pelos endpoints disponíveis
- **Teste Interativo**: Execute requisições diretamente pela interface
- **Exemplos de Resposta**: Veja exemplos de retorno para cada endpoint
- **Esquemas de Dados**: Visualize a estrutura dos dados de entrada e saída

### Endpoints Documentados

#### Monitor
- `GET /v1/health` - Verificação de saúde da aplicação
  - Retorna status da aplicação e informações do servidor
  - Response: 200 (success) ou 500 (error)

## 🛠️ Estrutura Técnica

### Arquivos de Configuração
- `src/infra/swagger/config.ts` - Configuração principal do Swagger
- `src/infra/http/server.ts` - Integração do Swagger UI com Express
- `src/infra/http/routes/*.ts` - Anotações JSDoc para documentação dos endpoints

### Dependências Utilizadas
- `swagger-jsdoc`: Geração de especificação OpenAPI a partir de JSDoc
- `swagger-ui-express`: Interface web para visualização da documentação
- `@types/swagger-jsdoc`: Tipagens TypeScript para swagger-jsdoc
- `@types/swagger-ui-express`: Tipagens TypeScript para swagger-ui-express

## 🔧 Configurações

### Ambientes
- **Desenvolvimento**: Swagger UI habilitado em `/api-docs`
- **Produção**: Swagger UI desabilitado por segurança

### Servidores Configurados
- **Local**: `http://localhost:4444/v1`
- **Produção**: `https://api.leadlovers.com/mcp-client/v1`

## 📝 Como Adicionar Nova Documentação

Para documentar novos endpoints, adicione anotações JSDoc no formato:

```typescript
/**
 * @swagger
 * /endpoint:
 *   get:
 *     summary: Descrição breve do endpoint
 *     description: Descrição detalhada
 *     tags: [NomeDoTag]
 *     parameters:
 *       - in: query
 *         name: parametro
 *         schema:
 *           type: string
 *         description: Descrição do parâmetro
 *     responses:
 *       200:
 *         description: Sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ResponseSchema'
 */
```

### Schemas Disponíveis
- `HealthCheckResponse`: Resposta do endpoint de health check
- `ErrorResponse`: Resposta padrão para erros

## 🎯 Próximos Passos

- [ ] Documentar endpoints de MCP quando implementados
- [ ] Adicionar exemplos de autenticação quando necessário  
- [ ] Configurar rate limiting na documentação
- [ ] Adicionar validação de schemas com Zod integration

## 🔍 Teste da Implementação

Para verificar se tudo está funcionando:

```bash
# 1. Inicie o servidor
npm run dev

# 2. Acesse no navegador
http://localhost:4444/api-docs

# 3. Teste o endpoint de health
curl http://localhost:4444/v1/health
```

Resposta esperada:
```json
{
  "status": "available",
  "serverInfo": {
    "version": "1",
    "environment": "development", 
    "timestamp": "2025-01-15T10:30:00.000Z",
    "uptime": 30.5
  }
}
```