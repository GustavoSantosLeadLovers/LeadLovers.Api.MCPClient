# Guia de Contribuição

## 🎯 Como Contribuir

Obrigado pelo seu interesse em contribuir para o LeadLovers MCP Client! Este guia irá te ajudar a fazer contribuições efetivas.

## 📋 Antes de Começar

### 1. Leia a Documentação
- [README.md](README.md) - Visão geral do projeto
- [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) - Arquitetura do sistema
- [docs/DEVELOPMENT.md](docs/DEVELOPMENT.md) - Workflow de desenvolvimento
- [docs/SETUP.md](docs/SETUP.md) - Configuração do ambiente

### 2. Configure seu Ambiente
```bash
# Clone o repositório
git clone https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient.git
cd LeadLovers.Api.MCPClient

# Instale as dependências
npm install

# Configure o ambiente
cp .env.example .env

# Teste se tudo está funcionando
npm run dev
curl http://localhost:4444/v1/health
```

## 🐛 Reportando Bugs

### Antes de Reportar
- Verifique se o bug já foi reportado nas [issues existentes](https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient/issues)
- Certifique-se de que está usando a versão mais recente
- Tente reproduzir o bug em um ambiente limpo

### Template de Bug Report
```markdown
## Descrição do Bug
Descrição clara e concisa do bug.

## Para Reproduzir
1. Execute '...'
2. Clique em '...'
3. Veja o erro

## Comportamento Esperado
Descrição do que deveria acontecer.

## Comportamento Atual
Descrição do que está acontecendo.

## Ambiente
- OS: [e.g. Windows 11]
- Node.js: [e.g. 20.10.0]
- npm: [e.g. 10.2.3]
- Branch/Commit: [e.g. main@abc1234]

## Screenshots/Logs
Se aplicável, adicione screenshots ou logs de erro.

## Contexto Adicional
Qualquer outra informação relevante.
```

## ✨ Solicitando Features

### Template de Feature Request
```markdown
## Descrição da Feature
Descrição clara da funcionalidade desejada.

## Motivação
Por que esta feature é necessária? Qual problema resolve?

## Solução Proposta
Descrição detalhada de como você imagina que a feature funcionaria.

## Alternativas Consideradas
Outras abordagens que foram consideradas.

## Contexto Adicional
Screenshots, mockups, ou outras informações relevantes.
```

## 🔧 Desenvolvendo uma Contribuição

### 1. Workflow de Desenvolvimento

#### Fork e Clone
```bash
# Fork o repositório no GitHub
# Clone seu fork
git clone https://github.com/SEU-USERNAME/LeadLovers.Api.MCPClient.git
cd LeadLovers.Api.MCPClient

# Adicione o repositório original como upstream
git remote add upstream https://github.com/GustavoSantosLeadLovers/LeadLovers.Api.MCPClient.git
```

#### Criar Branch
```bash
# Sempre partir da main atualizada
git checkout main
git pull upstream main

# Criar branch para sua feature/fix
git checkout -b feat/minha-nova-feature
# ou
git checkout -b fix/corrigir-bug-especifico
```

#### Desenvolvimento
```bash
# Faça suas alterações
# Execute os testes
npm run lint
npm run build

# Teste manualmente
npm run dev
curl http://localhost:4444/v1/health
```

### 2. Padrões de Código

#### TypeScript
```typescript
// ✅ Bom
interface UsuarioDTO {
  id: number;
  nome: string;
  email: string;
}

export class UsuarioHandler {
  public async criarUsuario(req: Request, res: Response): Promise<void> {
    // implementação
  }
}

// ❌ Ruim
class usuario {
  createUser(req, res) {
    // implementação
  }
}
```

#### Naming Conventions
- **Classes**: PascalCase (`UsuarioHandler`)
- **Functions/Methods**: camelCase (`criarUsuario`)
- **Variables**: camelCase (`nomeUsuario`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_RETRY_ATTEMPTS`)
- **Files**: kebab-case (`usuario-handler.ts`)
- **Folders**: kebab-case (`shared-utils`)

#### Estrutura de Arquivos
```typescript
// src/modules/exemplo/presentation/handlers/exemploHandler.ts
import { Request, Response } from 'express';
import { z } from 'zod';

import logger from '@src/infra/logger/pinoLogger';
import { ExemploDTO } from '../dtos/exemploDTO';

export class ExemploHandler {
  public async handle(req: Request, res: Response): Promise<void> {
    try {
      const validation = ExemploDTO.safeParse(req.body);
      
      if (!validation.success) {
        logger.warn('Validation failed', { errors: validation.error.errors });
        res.status(400).json({ error: 'Dados inválidos', details: validation.error });
        return;
      }

      const resultado = await this.processarExemplo(validation.data);
      
      logger.info('Exemplo processado com sucesso', { id: resultado.id });
      res.status(200).json(resultado);
    } catch (error) {
      logger.error('Erro ao processar exemplo', { error: error.message });
      res.status(500).json({ error: 'Erro interno do servidor' });
    }
  }

  private async processarExemplo(data: ExemploData): Promise<ExemploResult> {
    // lógica de negócio
  }
}
```

### 3. Documentação

#### Swagger/OpenAPI
```typescript
/**
 * @swagger
 * /usuarios:
 *   post:
 *     summary: Cria novo usuário
 *     description: Cria um novo usuário no sistema
 *     tags: [Usuários]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CriarUsuarioRequest'
 *           example:
 *             nome: "João Silva"
 *             email: "joao@exemplo.com"
 *     responses:
 *       201:
 *         description: Usuário criado com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsuarioResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
```

#### Comentários no Código
```typescript
// ✅ Bom - Explica o "por quê"
// Retornamos 202 porque o processamento é assíncrono
// e será completado em background
res.status(202).json({ message: 'Processamento iniciado' });

// ✅ Bom - JSDoc para funções públicas
/**
 * Valida e processa dados de entrada do usuário
 * @param dados - Dados brutos do usuário
 * @returns Dados processados e validados
 * @throws {ValidationError} Quando dados são inválidos
 */
public async processarDados(dados: unknown): Promise<DadosProcessados> {
  // implementação
}

// ❌ Ruim - Explica o "o quê" (óbvio)
// Incrementa contador
contador++;
```

### 4. Testes (Planejado)

#### Estrutura de Teste
```typescript
// tests/unit/modules/exemplo/handlers/exemploHandler.test.ts
import { Request, Response } from 'express';
import { ExemploHandler } from '@src/modules/exemplo/presentation/handlers/exemploHandler';

describe('ExemploHandler', () => {
  let handler: ExemploHandler;
  let mockReq: Partial<Request>;
  let mockRes: Partial<Response>;

  beforeEach(() => {
    handler = new ExemploHandler();
    mockReq = { body: {} };
    mockRes = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
  });

  describe('handle', () => {
    it('should return 200 when data is valid', async () => {
      // Arrange
      mockReq.body = { nome: 'Teste', email: 'teste@exemplo.com' };

      // Act
      await handler.handle(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(200);
      expect(mockRes.json).toHaveBeenCalledWith(
        expect.objectContaining({ success: true })
      );
    });

    it('should return 400 when data is invalid', async () => {
      // Arrange
      mockReq.body = { nome: '', email: 'email-invalido' };

      // Act
      await handler.handle(mockReq as Request, mockRes as Response);

      // Assert
      expect(mockRes.status).toHaveBeenCalledWith(400);
    });
  });
});
```

## 📝 Processo de Pull Request

### 1. Antes de Enviar
```bash
# Certifique-se de que o código está formatado
npm run prettier

# Execute linting
npm run lint

# Faça build para verificar tipos
npm run build

# Execute testes (quando implementados)
npm test
```

### 2. Commits
Use a [convenção de commits semânticos](https://www.conventionalcommits.org/):

```bash
# ✅ Exemplos bons
git commit -m "feat: adiciona endpoint de criação de usuários"
git commit -m "fix: corrige validação de email no health check"
git commit -m "docs: atualiza README com instruções de deploy"
git commit -m "refactor: move handlers para pasta separada"
git commit -m "chore: atualiza dependências de segurança"

# ❌ Exemplos ruins
git commit -m "update code"
git commit -m "fix stuff"
git commit -m "WIP"
```

### 3. Template de Pull Request
```markdown
## Descrição
Descrição breve das mudanças implementadas.

## Tipo de Mudança
- [ ] Bug fix (mudança que corrige um problema)
- [ ] Nova feature (mudança que adiciona funcionalidade)
- [ ] Breaking change (mudança que quebra compatibilidade)
- [ ] Documentação
- [ ] Refatoração

## Como Testar
1. Execute `npm run dev`
2. Acesse `http://localhost:4444/v1/novo-endpoint`
3. Verifique que retorna status 200

## Checklist
- [ ] Código segue os padrões do projeto
- [ ] Documentação foi atualizada (se necessário)
- [ ] Testes foram adicionados/atualizados
- [ ] Build passa sem erros (`npm run build`)
- [ ] Linting passa sem erros (`npm run lint`)

## Screenshots (se aplicável)
Adicione screenshots para mudanças visuais.

## Issues Relacionadas
Closes #123
```

### 4. Review Process
1. **Automated Checks**: CI/CD irá executar testes e verificações
2. **Code Review**: Maintainers irão revisar o código
3. **Changes Requested**: Implemente mudanças solicitadas
4. **Approval**: PR aprovado e merged

## 📊 Diretrizes de Review

### Como Reviewer
- Seja construtivo e respeitoso
- Foque na qualidade, legibilidade e manutenibilidade
- Verifique se a solução resolve o problema proposto
- Teste localmente quando necessário

### Como Autor
- Responda aos comentários de forma construtiva
- Faça commits incrementais para mudanças solicitadas
- Mantenha o PR focado (uma feature/fix por PR)
- Atualize a descrição se necessário

## 🏷️ Labels do GitHub

### Tipos
- `bug` - Correção de bugs
- `feature` - Nova funcionalidade
- `enhancement` - Melhoria de funcionalidade existente
- `documentation` - Documentação
- `refactor` - Refatoração de código

### Prioridades
- `priority: high` - Alta prioridade
- `priority: medium` - Prioridade média
- `priority: low` - Baixa prioridade

### Status
- `needs: review` - Precisa de review
- `needs: testing` - Precisa de testes
- `needs: documentation` - Precisa de documentação
- `ready: to merge` - Pronto para merge

## 🚀 Release Process (Futuro)

### Versioning
Seguimos [Semantic Versioning](https://semver.org/):
- `MAJOR.MINOR.PATCH` (ex: 1.2.3)
- **MAJOR**: Breaking changes
- **MINOR**: Novas features (backward compatible)
- **PATCH**: Bug fixes (backward compatible)

### Changelog
Mantemos um [CHANGELOG.md](CHANGELOG.md) seguindo [Keep a Changelog](https://keepachangelog.com/).

## 🤝 Código de Conduta

### Nossos Valores
- **Respeito**: Trate todos com respeito e profissionalismo
- **Inclusão**: Ambiente acolhedor para pessoas de todos os backgrounds
- **Colaboração**: Trabalhe em equipe para o bem comum
- **Qualidade**: Comprometa-se com código de qualidade
- **Aprendizado**: Compartilhe conhecimento e aprenda com outros

### Comportamentos Esperados
- Use linguagem acolhedora e inclusiva
- Seja respeitoso com diferentes opiniões
- Aceite críticas construtivas com elegância
- Foque no que é melhor para a comunidade
- Demonstre empatia com outros membros

### Comportamentos Inaceitáveis
- Uso de linguagem ou imagens sexualizadas
- Trolling, comentários insultuosos ou ataques pessoais
- Assédio público ou privado
- Publicar informações privadas sem permissão
- Outras condutas consideradas inadequadas

## 📞 Contato

### Dúvidas sobre Contribuição
- **GitHub Issues**: Para dúvidas específicas sobre o código
- **Email**: [dev@leadlovers.com](mailto:dev@leadlovers.com)

### Reportar Violações
- **Email**: [conduct@leadlovers.com](mailto:conduct@leadlovers.com)

---

**Obrigado por contribuir! 🎉**

Cada contribuição, por menor que seja, ajuda a tornar o LeadLovers MCP Client melhor para todos.