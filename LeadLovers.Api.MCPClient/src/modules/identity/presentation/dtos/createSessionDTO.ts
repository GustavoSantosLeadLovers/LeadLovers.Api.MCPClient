import { z } from 'zod';

export const createSessionInput = z.object({
	token: z.string(),
	refreshToken: z.string(),
});

export const createSessionOutput = z.object({
	token: z.string(),
	name: z.string(),
	email: z.string(),
});
