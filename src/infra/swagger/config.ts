import swaggerJsdoc from 'swagger-jsdoc';
import { variables } from '@src/shared/configs/variables';

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
