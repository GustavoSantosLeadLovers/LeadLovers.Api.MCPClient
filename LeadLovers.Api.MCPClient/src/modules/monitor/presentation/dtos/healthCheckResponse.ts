import { z } from 'zod';

export const HealthCheckResponse = z.object({
	status: z.string(),
	serverInfo: z.object({
		version: z.number().int().nonnegative(),
		environment: z.string(),
		timestamp: z.string().datetime(),
		uptime: z.number().nonnegative(),
	}),
});

export type HealthCheckResponse = z.infer<typeof HealthCheckResponse>;
