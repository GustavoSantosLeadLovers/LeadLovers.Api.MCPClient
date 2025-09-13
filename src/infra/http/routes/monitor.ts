import { Router } from 'express';

import { HealthCheckHandler } from '@src/modules/monitor/presentation/handlers/healthCheckHandler';

const healthCheckHandler = new HealthCheckHandler();

/**
 * @swagger
 * /health:
 *   get:
 *     summary: Verificação de saúde da aplicação
 *     description: Retorna o status de saúde da aplicação e informações do servidor
 *     tags: [Monitor]
 *     responses:
 *       200:
 *         description: Aplicação funcionando normalmente
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HealthCheckResponse'
 *             example:
 *               status: "available"
 *               serverInfo:
 *                 version: "1.0.0"
 *                 environment: "development"
 *                 timestamp: "2024-01-15T10:30:00.000Z"
 *                 uptime: 3600.5
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
export const monitor = (router: Router): void => {
	router.get('/health', healthCheckHandler.handle);
};
