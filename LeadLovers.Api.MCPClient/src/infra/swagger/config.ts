import swaggerJsdoc from 'swagger-jsdoc';

import { variables } from '@shared/configs/variables';

const options: swaggerJsdoc.Options = {
	definition: {
		openapi: '3.0.0',
		info: {
			title: 'LeadLovers MCP Client API',
			version: String(variables.server.VERSION || '1.0.0'),
			description:
				'API do cliente MCP (Model Context Protocol) da LeadLovers para integração com serviços de IA',
			contact: {
				name: 'LeadLovers Development Team',
				email: 'dev@leadlovers.com',
			},
			license: {
				name: 'ISC',
			},
		},
		servers: [
			{
				url: `http://localhost:${String(variables.server.PORT)}/v1`,
				description: 'Servidor de desenvolvimento',
			},
			{
				url: 'https://api.leadlovers.com/mcp-client/v1',
				description: 'Servidor de produção',
			},
		],
		components: {
			schemas: {
				HealthCheckResponse: {
					type: 'object',
					properties: {
						status: {
							type: 'string',
							enum: ['available', 'unavailable'],
							description: 'Status de saúde da aplicação',
						},
						serverInfo: {
							type: 'object',
							properties: {
								version: {
									type: 'string',
									description: 'Versão da aplicação',
									example: '1.0.0',
								},
								environment: {
									type: 'string',
									description: 'Ambiente de execução',
									example: 'development',
								},
								timestamp: {
									type: 'string',
									format: 'date-time',
									description: 'Timestamp da resposta',
									example: '2024-01-15T10:30:00.000Z',
								},
								uptime: {
									type: 'number',
									description:
										'Tempo de atividade do servidor em segundos',
									example: 3600.5,
								},
							},
							required: [
								'version',
								'environment',
								'timestamp',
								'uptime',
							],
						},
					},
					required: ['status', 'serverInfo'],
				},
				CreateSessionRequest: {
					type: 'object',
					properties: {
						token: {
							type: 'string',
							description: 'Token de acesso SSO',
							example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
						},
						refreshToken: {
							type: 'string',
							description: 'Token de atualização SSO',
							example: 'refresh_token_example_here',
						},
					},
					required: ['token', 'refreshToken'],
				},
				CreateSessionResponse: {
					type: 'object',
					properties: {
						token: {
							type: 'string',
							description:
								'JWT token para autenticação da sessão',
							example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
						},
						name: {
							type: 'string',
							description: 'Nome do usuário',
							example: 'João Silva',
						},
						email: {
							type: 'string',
							format: 'email',
							description: 'Email do usuário',
							example: 'joao.silva@exemplo.com',
						},
					},
					required: ['token', 'name', 'email'],
				},
				ApiResponse: {
					type: 'object',
					properties: {
						status: {
							type: 'string',
							enum: ['success', 'error'],
							description: 'Status da resposta',
						},
						result: {
							description:
								'Dados da resposta ou detalhes do erro',
						},
					},
					required: ['status', 'result'],
				},
				ErrorResponse: {
					type: 'object',
					properties: {
						error: {
							type: 'string',
							description: 'Mensagem de erro',
						},
						message: {
							type: 'string',
							description: 'Detalhes do erro',
						},
						statusCode: {
							type: 'number',
							description: 'Código de status HTTP',
						},
					},
					required: ['error', 'statusCode'],
				},
			},
			responses: {
				InternalServerError: {
					description: 'Erro interno do servidor',
					content: {
						'application/json': {
							schema: {
								$ref: '#/components/schemas/ErrorResponse',
							},
						},
					},
				},
			},
		},
		tags: [
			{
				name: 'Monitor',
				description: 'Endpoints para monitoramento da aplicação',
			},
			{
				name: 'Identity',
				description:
					'Endpoints para autenticação e gerenciamento de sessão',
			},
			{
				name: 'MCP',
				description:
					'Endpoints para integração com Model Context Protocol (em desenvolvimento)',
			},
		],
	},
	apis: [
		'./src/infra/http/routes/*.ts',
		'./src/modules/*/presentation/handlers/*.ts',
	],
};

export const swaggerSpec = swaggerJsdoc(options);
