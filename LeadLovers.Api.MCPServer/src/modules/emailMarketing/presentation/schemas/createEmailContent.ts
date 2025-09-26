import { z } from 'zod';

export const createEmailContentInputShape = {
  prompt: z
    .string()
    .min(50)
    .describe('Informações sobre o conteúdo do e-mail que será criado (obrigatório)'),
};

export const createEmailContentOutputShape = {
  fullJson: z.string(),
};

export const createEmailContentToolInput = z.object(createEmailContentInputShape);
export const createEmailContentToolOutput = z.object(createEmailContentOutputShape);

export type CreateEmailContentToolInput = z.infer<typeof createEmailContentToolInput>;
export type CreateEmailContentToolOutput = z.infer<typeof createEmailContentToolOutput>;