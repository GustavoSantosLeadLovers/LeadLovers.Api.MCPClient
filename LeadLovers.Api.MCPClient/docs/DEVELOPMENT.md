# Guia de Desenvolvimento

## 🛠️ Configuração do Ambiente de Desenvolvimento

### Scripts Principais

| Script | Comando | Descrição |
|--------|---------|-----------|
| **Desenvolvimento** | `npm run dev` | Inicia servidor com hot-reload e debugging |
| **Build** | `npm run build` | Compila TypeScript para JavaScript |
| **Produção** | `npm start` | Executa aplicação compilada |
| **Linting** | `npm run lint` | Executa ESLint com correção automática |
| **Formatação** | `npm run prettier` | Formata código com Prettier |
| **Validação** | `npm run validate-branch-name` | Valida nome da branch |

### Fluxo de Desenvolvimento

```bash
# 1. Clonar repositório
git clone <repo-url>
cd LeadLovers.Api.MCPClient

# 2. Instalar dependências
npm install

# 3. Configurar ambiente
cp .env.example .env

# 4. Iniciar desenvolvimento
npm run dev

# 5. Fazer alterações e testar
curl http://localhost:4444/v1/health
```

## 🔄 Workflow Git

### Padrão de Branches

```
main                    # Branch principal (produção)
├── feat/nova-feature   # Nova funcionalidade
├── fix/corrigir-bug    # Correção de bug
├── docs/atualizar-doc  # Documentação
├── chore/config        # Configuração/manutenção
├── refactor/refactor   # Refatoração
└── test/adicionar-test # Testes
```

### Nomenclatura de Branches

#### ✅ Válidos
```bash
feat/implementar-mcp-client
fix/corrigir-health-check
docs/adicionar-swagger
chore/atualizar-dependencias
refactor/reestruturar-modules
test/adicionar-testes-unitarios
```

#### ❌ Inválidos
```bash
feature-nova               # Usar feat/ no início
bugfix/problema           # Usar fix/
nova_funcionalidade       # Usar kebab-case
FEAT/NOVA-FEATURE        # Usar lowercase
```

### Fluxo de Trabalho

#### 1. Criar Nova Branch
```bash
# Sempre partir da main atualizada
git checkout main
git pull origin main

# Criar nova branch
git checkout -b feat/nova-funcionalidade
```

#### 2. Desenvolvimento
```bash
# Fazer alterações
# Testar localmente
npm run dev

# Verificar qualidade do código
npm run lint
npm run build
```

#### 3. Commit
```bash
# Adicionar arquivos
git add .

# Commit com mensagem semântica
git commit -m "feat: implementa nova funcionalidade X"
```

#### 4. Push e Pull Request
```bash
# Enviar para remote
git push origin feat/nova-funcionalidade

# Criar Pull Request via GitHub
```

## 📝 Convenção de Commits

### Formato
```
<tipo>(<escopo>): <descrição>

<corpo (opcional)>

<rodapé (opcional)>
```

### Tipos de Commit

| Tipo | Descrição | Exemplo |
|------|-----------|---------|
| `feat` | Nova funcionalidade | `feat: adiciona endpoint de usuários` |
| `fix` | Correção de bug | `fix: corrige validação do health check` |
| `docs` | Documentação | `docs: atualiza README com instruções` |
| `style` | Formatação de código | `style: aplica prettier em arquivos TS` |
| `refactor` | Refatoração | `refactor: move handlers para pasta separada` |
| `test` | Adição de testes | `test: adiciona testes para health check` |
| `chore` | Manutenção | `chore: atualiza dependências` |
| `perf` | Melhoria de performance | `perf: otimiza consulta de health check` |
| `ci` | Integração contínua | `ci: adiciona workflow de deploy` |

### Exemplos de Commits

#### ✅ Bons Commits
```bash
feat: implementa graceful shutdown
fix: corrige tipagem do health check response
docs: adiciona documentação da arquitetura
refactor: reorganiza estrutura de pastas dos modules
chore: atualiza dependências de segurança
```

#### ❌ Commits Ruins
```bash
update code              # Muito genérico
Fix bug                 # Não especifica qual bug
Added new feature       # Não especifica qual feature
asdjklasdjkl           # Sem sentido
```

## 🏗️ Estrutura de Desenvolvimento

### Adicionando Novo Endpoint

#### 1. Criar DTO
```typescript
// src/modules/exemplo/presentation/dtos/exemploRequest.ts
import { z } from 'zod';

export const ExemploRequest = z.object({
  nome: z.string().min(1),
  email: z.string().email(),
});

export type ExemploRequestType = z.infer<typeof ExemploRequest>;
```

#### 2. Criar Handler
```typescript
// src/modules/exemplo/presentation/handlers/exemploHandler.ts
import { Request, Response } from 'express';
import { ExemploRequest } from '../dtos/exemploRequest';

export class ExemploHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    const validation = ExemploRequest.safeParse(req.body);
    
    if (!validation.success) {
      res.status(400).json({ error: validation.error });
      return;
    }

    const { nome, email } = validation.data;
    
    // Lógica de negócio aqui
    
    res.status(200).json({ success: true, data: { nome, email } });
  }
}
```

#### 3. Criar Rota com Swagger
```typescript
// src/infra/http/routes/exemplo.ts
import { Router } from 'express';
import { ExemploHandler } from '@src/modules/exemplo/presentation/handlers/exemploHandler';

const exemploHandler = new ExemploHandler();

/**
 * @swagger
 * /exemplo:
 *   post:
 *     summary: Cria novo exemplo
 *     tags: [Exemplo]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Sucesso
 *       400:
 *         description: Dados inválidos
 */
export const exemplo = (router: Router): void => {
  router.post('/exemplo', exemploHandler.handle.bind(exemploHandler));
};
```

#### 4. Registrar Rota
```typescript
// src/infra/http/routes/index.ts
import { Router } from 'express';
import { monitor } from './monitor';
import { exemplo } from './exemplo'; // Nova importação

const router = Router({ mergeParams: true });

export const routes = () => {
  monitor(router);
  exemplo(router); // Registrar nova rota
  return router;
};
```

### Adicionando Novo Módulo

#### 1. Criar Estrutura
```bash
src/modules/novo-modulo/
├── application/          # Casos de uso (futuro)
├── domain/              # Regras de negócio (futuro)  
├── infrastructure/      # Adaptadores (futuro)
└── presentation/        # Camada de apresentação
    ├── dtos/           # Data Transfer Objects
    └── handlers/       # Manipuladores HTTP
```

#### 2. Seguir Padrões
- Usar Clean Architecture
- DTOs com validação Zod
- Handlers tipados
- Documentação Swagger
- Testes unitários

## 🧪 Testes (Planejado)

### Estrutura de Testes
```
tests/
├── unit/               # Testes unitários
│   ├── modules/
│   │   └── monitor/
│   │       └── handlers/
│   └── shared/
├── integration/        # Testes de integração
│   └── http/
└── e2e/               # Testes end-to-end
    └── api/
```

### Convenções de Teste
```typescript
// tests/unit/modules/monitor/handlers/healthCheckHandler.test.ts
import { HealthCheckHandler } from '@src/modules/monitor/presentation/handlers/healthCheckHandler';

describe('HealthCheckHandler', () => {
  let handler: HealthCheckHandler;

  beforeEach(() => {
    handler = new HealthCheckHandler();
  });

  it('should return health check data', async () => {
    // Test implementation
  });
});
```

## 🔍 Debug e Monitoramento

### Debug Local
```bash
# Iniciar com debug habilitado
npm run dev

# O servidor iniciará com inspect na porta 9229
# Conectar com debugger:
# - VS Code: usar launch.json
# - Chrome DevTools: chrome://inspect
```

### Logs Estruturados
```typescript
import logger from '@src/infra/logger/pinoLogger';

// Log de info
logger.info('Operação realizada com sucesso', { userId: 123 });

// Log de erro
logger.error('Erro ao processar requisição', { error: error.message, stack: error.stack });

// Log com contexto
logger.child({ requestId: 'abc-123' }).info('Processando requisição');
```

### Monitoramento de Performance
```typescript
// Medir tempo de execução
const start = Date.now();
// ... operação ...
const duration = Date.now() - start;
logger.info('Operação concluída', { duration });
```

## 📊 Qualidade de Código

### ESLint Rules
```json
// eslint.config.mjs (principais regras)
{
  "rules": {
    "@typescript-eslint/no-unused-vars": "error",
    "@typescript-eslint/explicit-function-return-type": "warn",
    "prefer-const": "error",
    "no-var": "error"
  }
}
```

### Prettier Configuration
```json
// .prettierrc
{
  "semi": true,
  "trailingComma": "all",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2,
  "useTabs": true
}
```

### Pre-commit Hooks
```json
// .husky/pre-commit
#!/usr/bin/env sh
. "$(dirname -- "$0")/_/husky.sh"

npm run lint-staged
npm run validate-branch-name
```

## 🚀 Deploy e CI/CD (Futuro)

### Pipeline Planejado
```yaml
# .github/workflows/ci.yml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run lint
      - run: npm run build
      - run: npm test

  deploy:
    if: github.ref == 'refs/heads/main'
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Deploy to production
        run: echo "Deploy logic here"
```

## 🔧 Troubleshooting

### Problemas Comuns

#### TypeScript Errors
```bash
# Limpar cache e rebuildar
rm -rf dist/
npm run build
```

#### Port Already in Use
```bash
# Encontrar processo usando a porta
lsof -i :4444
kill -9 <PID>

# Ou mudar porta no .env
PORT=4445
```

#### Module Resolution
```bash
# Verificar paths no tsconfig.json
cat tsconfig.json | grep paths -A 10
```

## 📚 Recursos Úteis

### Documentação de Referência
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Express.js Guide](https://expressjs.com/en/guide/)
- [Zod Documentation](https://zod.dev/)
- [Pino Logger](https://getpino.io/)

### Ferramentas de Desenvolvimento
- [Postman/Insomnia](https://www.postman.com/) - Teste de APIs
- [Bruno](https://www.usebruno.com/) - Cliente HTTP opensource
- [Thunder Client](https://www.thunderclient.com/) - Extension VS Code

### Extensões VS Code Recomendadas
- TypeScript Hero
- REST Client
- GitLens
- Thunder Client
- Error Lens