import { z } from 'zod';

export const healthCheckOutput = z.object({
	status: z.string(),
	serverInfo: z.object({
		version: z.number().int().nonnegative(),
		environment: z.string(),
		timestamp: z.string().datetime(),
		uptime: z.number().nonnegative(),
	}),
});

export type HealthCheckOutput = z.infer<typeof healthCheckOutput>;
