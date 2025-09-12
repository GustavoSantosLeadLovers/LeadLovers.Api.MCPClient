import cors from 'cors';
import express, { Application } from 'express';
import { Server } from 'node:http';

import { variables } from '@src/shared/configs/variables';
import logger from '../logger/pinoLogger';
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

	private setupRoutes(): void {
		this.app.use('/v1', routes());
	}

	public listen(): Server {
		this.setCors();
		this.setupRoutes();
		return this.app.listen(this.port, () =>
			logger.info(`Server running in port: ${this.port}`),
		);
	}
}
