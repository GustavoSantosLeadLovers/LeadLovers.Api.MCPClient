import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'node:http';
import swaggerUi from 'swagger-ui-express';

import { variables } from '@src/shared/configs/variables';
import logger from '../logger/pinoLogger';
import { swaggerSpec } from '../swagger/config';
import { routes } from './routes';

export class ExpressApp {
	private readonly app: Application;
	private readonly port: number = variables.server.PORT;

	constructor() {
		this.app = express();
		this.app.use(express.json());
		this.app.use(express.urlencoded({ extended: true }));
	}

	private setCors() {
		const isDev = variables.server.NODE_ENV !== 'production';
		const domainUrl = variables.server.DOMAIN_URL;
		const options: cors.CorsOptions = {
			allowedHeaders: [
				'Origin',
				'X-Requested-With',
				'Accept',
				'Content-Type',
				'X-Access-Token',
				'Authorization',
			],
			credentials: true,
			methods: 'GET,HEAD,OPTIONS,PUT,PATCH,POST,DELETE',
			origin: isDev ? '*' : domainUrl.split(','),
			preflightContinue: false,
		};
		this.app.use(cors(options));
	}

	private setupSwagger(): void {
		const isDev = variables.server.NODE_ENV !== 'production';
		if (isDev) {
			this.app.use(
				'/api-docs',
				swaggerUi.serve,
				swaggerUi.setup(swaggerSpec, {
					explorer: true,
					customSiteTitle: 'LeadLovers MCP Client API Documentation',
					customfavIcon: '/favicon.ico',
					swaggerOptions: {
						persistAuthorization: true,
					},
				}),
			);
			logger.info('Swagger documentation available at /api-docs');
		}
	}

	private setupRoutes(): void {
		this.app.use('/v1', routes());
	}

	public listen(): Server {
		this.setCors();
		this.setupSwagger();
		this.setupRoutes();
		return this.app.listen(this.port, () =>
			logger.info(`Server running in port: ${this.port}`),
		);
	}
}
