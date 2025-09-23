import { z } from 'zod';

export const createBeeFreeSessionInput = z.object({
	clientId: z.string(),
	clientSecret: z.string(),
	userId: z.string().optional(),
});

export const createBeeFreeSessionOutput = z.object({
	token: z.string(),
});

export type CreateBeeFreeSessionOutput = z.infer<
	typeof createBeeFreeSessionOutput
>;
