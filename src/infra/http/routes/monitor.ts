import { Router } from 'express';

import { HealthCheckHandler } from '@src/modules/monitor/presentation/handlers/healthCheckHandler';

const healthCheckHandler = new HealthCheckHandler();

export const monitor = (router: Router): void => {
	router.get('/health', healthCheckHandler.handle);
};
