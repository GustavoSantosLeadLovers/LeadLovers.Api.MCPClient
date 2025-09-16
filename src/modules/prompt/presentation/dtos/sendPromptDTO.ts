import { z } from 'zod';

export const sendPromptInput = z.object({
	prompt: z.string().min(1, 'Prompt text is required').max(5000),
	userId: z.string().min(1, 'User ID is required'),
	userEmail: z.string().email('Valid email is required'),
	userName: z.string().min(1, 'User name is required'),
});

export const sendPromptOutput = z.object({
	status: z.enum(['success', 'error']),
	result: z.unknown(),
});

export type SendPromptInput = z.infer<typeof sendPromptInput>;
export type SendPromptOutput = z.infer<typeof sendPromptOutput>;
