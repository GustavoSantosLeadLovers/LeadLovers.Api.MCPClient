import { z } from 'zod';

export const createEmailContentSchema = z.object({
  prompt: z.string().min(50)
});

export type CreateEmailContentInput = z.infer<typeof createEmailContentSchema>;
