# WebSocket Server Documentation

## Overview

O servidor WebSocket fornece comunicação em tempo real entre clientes e o servidor, com autenticação JWT, gerenciamento de sessões únicas por usuário e integração com Redis para persistência.

## Tecnologias Utilizadas

- **Socket.IO**: Framework WebSocket com fallback automático
- **Redis**: Cache e persistência de conexões
- **JWT**: Autenticação de clientes
- **TypeScript**: Type safety e melhor developer experience

## Arquitetura

### Componentes Principais

#### 1. WebSocket Server (`src/infra/web-socket/server.ts`)
- Gerencia conexões Socket.IO
- Implementa política de conexão única por usuário
- Integra com Redis para persistência de sessões
- Processa eventos de clientes autenticados

#### 2. Auth Middleware (`src/infra/web-socket/middlewares/authMiddleware.ts`)
- Valida tokens JWT antes de estabelecer conexão
- Extrai informações do usuário do token
- Suporta múltiplas formas de envio do token (auth, headers, query)

#### 3. Redis Client (`src/shared/providers/Redis/redisClient.ts`)
- Singleton para gerenciamento de conexões Redis
- Reconexão automática com backoff strategy
- Operações básicas de cache (get, set, delete, exists)

## Funcionalidades

### Autenticação

O servidor aceita tokens JWT em três formatos:

1. **Socket auth** (preferencial):
```javascript
const socket = io('http://localhost:3001', {
  auth: {
    token: 'seu-jwt-token'
  }
});
```

2. **Headers Authorization**:
```javascript
const socket = io('http://localhost:3001', {
  extraHeaders: {
    Authorization: 'Bearer seu-jwt-token'
  }
});
```

3. **Query parameter**:
```javascript
const socket = io('http://localhost:3001', {
  query: {
    token: 'seu-jwt-token'
  }
});
```

### Conexão Única por Usuário

O servidor garante que cada usuário tenha apenas uma conexão ativa:

1. Nova conexão verifica se existe conexão anterior no Redis
2. Se existir, desconecta a conexão anterior
3. Armazena o ID da nova conexão no Redis
4. TTL de 1 hora para limpeza automática

### Eventos Disponíveis

#### Cliente → Servidor

##### `send-prompt`
Envia um prompt para processamento.

```javascript
socket.emit('send-prompt', {
  prompt: 'Sua mensagem aqui'
});
```

#### Servidor → Cliente

##### `prompt-response`
Resposta ao prompt enviado.

```javascript
socket.on('prompt-response', (response) => {
  console.log('Resposta:', response);
});
```

##### `error`
Erros de processamento ou autenticação.

```javascript
socket.on('error', (error) => {
  console.error('Erro:', error.message);
});
```

## Configuração

### Variáveis de Ambiente

```env
# Porta do servidor WebSocket (padrão: 3001)
PORT=3001

# URLs permitidas para CORS
DOMAIN_URL=http://localhost:3000,http://app.example.com

# Redis
REDIS_URL=redis://localhost:6379
REDIS_PASSWORD=opcional

# JWT
JWT_SECRET=seu-secret-jwt
```

### Docker Compose

O projeto inclui configuração Docker Compose para Redis:

```bash
# Iniciar Redis
docker-compose up -d redis

# Parar Redis
docker-compose down
```

## Desenvolvimento

### Estrutura de Pastas

```
src/infra/web-socket/
├── server.ts              # Classe principal do servidor
└── middlewares/
    └── authMiddleware.ts  # Middleware de autenticação

src/shared/providers/Redis/
└── redisClient.ts         # Cliente Redis singleton
```

### Exemplo de Uso

#### Cliente JavaScript/TypeScript

```javascript
import { io } from 'socket.io-client';

// Conectar ao servidor
const socket = io('http://localhost:3001', {
  auth: {
    token: localStorage.getItem('jwt-token')
  }
});

// Eventos de conexão
socket.on('connect', () => {
  console.log('Conectado!', socket.id);
});

socket.on('disconnect', (reason) => {
  console.log('Desconectado:', reason);
});

// Enviar prompt
socket.emit('send-prompt', {
  prompt: 'Como posso ajudar?'
});

// Receber resposta
socket.on('prompt-response', (response) => {
  console.log('Resposta recebida:', response);
});

// Tratar erros
socket.on('error', (error) => {
  console.error('Erro:', error);
});
```

#### HTML de Teste

Um arquivo `test-websocket-auth.html` está disponível para testar a conexão WebSocket:

```bash
# Abrir no navegador
open test-websocket-auth.html
```

## Monitoramento

### Logs

O servidor utiliza Pino logger para registrar:
- Conexões e desconexões de clientes
- Autenticações bem-sucedidas e falhas
- Erros de socket
- Eventos de prompt

### Redis

Monitorar conexões ativas:

```bash
# Conectar ao Redis CLI
docker exec -it leadlovers-redis redis-cli

# Listar todas as chaves de conexão
KEYS ws:user:connection:*

# Ver detalhes de uma conexão
GET ws:user:connection:<user-id>
```

## Segurança

### Práticas Implementadas

1. **Autenticação JWT obrigatória**: Todas as conexões devem fornecer token válido
2. **Validação de origem (CORS)**: Apenas domínios autorizados em produção
3. **Conexão única por usuário**: Previne múltiplas sessões simultâneas
4. **TTL em cache**: Limpeza automática de sessões expiradas
5. **Graceful shutdown**: Fechamento limpo de conexões

### Recomendações

1. Use HTTPS/WSS em produção
2. Implemente rate limiting para eventos
3. Monitore tentativas de autenticação falhas
4. Configure timeouts apropriados
5. Use tokens com expiração curta

## Troubleshooting

### Problemas Comuns

#### Conexão recusada
- Verificar se o servidor está rodando
- Confirmar porta correta (padrão: 3001)
- Validar CORS configuration

#### Autenticação falha
- Verificar validade do token JWT
- Confirmar JWT_SECRET correto
- Checar formato do token (Bearer prefix se necessário)

#### Redis connection error
- Verificar se Redis está rodando
- Confirmar REDIS_URL correto
- Checar credenciais se configuradas

#### Desconexões frequentes
- Verificar estabilidade da rede
- Aumentar timeouts do Socket.IO
- Implementar reconexão automática no cliente

## Performance

### Otimizações Implementadas

1. **Redis como cache**: Reduz consultas ao banco de dados
2. **Conexão única**: Limita uso de recursos por usuário
3. **Event handlers eficientes**: Processamento assíncrono
4. **Singleton pattern**: Reutilização de conexões

### Métricas Recomendadas

- Número de conexões ativas
- Tempo médio de resposta para eventos
- Taxa de reconexão
- Uso de memória do Redis
- Latência de rede

## Roadmap

### Implementado ✅
- Servidor WebSocket básico
- Autenticação JWT
- Integração com Redis
- Conexão única por usuário
- Eventos de prompt

### Planejado 📋
- [ ] Rooms/namespaces para segregação
- [ ] Rate limiting por usuário
- [ ] Métricas e dashboards
- [ ] Clustering para escalabilidade
- [ ] Persistência de mensagens
- [ ] Reconexão automática com state recovery