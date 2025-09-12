import { Request, Response } from 'express';

import logger from '@src/infra/logger/pinoLogger';
import { variables } from '@src/shared/configs/variables';
import { HealthCheckResponse } from '../dtos/healthCheckResponse';

export class HealthCheckHandler {
	public async handle(_: Request, response: Response) {
		const data = {
			status: 'available',
			serverInfo: {
				version: variables.server.VERSION,
				environment: variables.server.NODE_ENV,
				timestamp: new Date().toISOString(),
				uptime: process.uptime(),
			},
		};
		const output = HealthCheckResponse.safeParse(data);
		if (output.error) {
			logger.error(output.error);
			response.status(500).json(output.error);
			return;
		}
		response.status(200).json(output.data);
	}
}
