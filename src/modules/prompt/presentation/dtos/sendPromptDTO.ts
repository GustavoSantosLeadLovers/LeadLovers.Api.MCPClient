import { z } from 'zod';

export const sendPromptInput = z.object({
	prompt: z.string().min(1).max(5000),
});

export const sendPromptOutput = z.object({
	status: z.enum(['success', 'error']),
	result: z.unknown(),
});

export type SendPromptInput = z.infer<typeof sendPromptInput>;
export type SendPromptOutput = z.infer<typeof sendPromptOutput>;
