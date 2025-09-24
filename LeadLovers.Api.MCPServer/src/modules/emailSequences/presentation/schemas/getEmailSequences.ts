import { z } from 'zod';

export const getEmailSequencesInputShape = {
  machineCode: z
    .number()
    .int()
    .positive()
    .describe('Código da máquina para a qual as sequências de e-mail serão obtidas (obrigatório)'),
};

export const getEmailSequencesOutputShape = {
  Items: z.array(
    z.object({
      SequenceCode: z.number().int().describe('Código da sequência de e-mail'),
      SequenceName: z.string().describe('Nome da sequência de e-mail'),
    })
  ),
};

export const getEmailSequencesToolInput = z.object(getEmailSequencesInputShape);
export const getEmailSequencesToolOutput = z.object(getEmailSequencesOutputShape);

export type GetEmailSequencesToolInput = z.infer<typeof getEmailSequencesToolInput>;
export type GetEmailSequencesToolOutput = z.infer<typeof getEmailSequencesToolOutput>;
