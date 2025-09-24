import { z } from 'zod';

export const deleteLeadInputShape = {
  machineCode: z
    .number()
    .min(0)
    .describe(
      'Código da máquina para localizar a sequência da qual o lead será removido (obrigatório)'
    ),
  sequenceCode: z.number().min(0).describe('Código da sequência de e-mail (obrigatório)'),
  phone: z.string().max(100).optional().describe('Telefone do lead (opcional)'),
  email: z.string().email().max(100).optional().describe('E-mail do lead (opcional)'),
};

export const deleteLeadOutputShape = {
  Message: z.string().describe('Mensagem detalhada sobre o resultado da operação'),
};

export const deleteLeadToolInput = z.object(deleteLeadInputShape);
export const deleteLeadToolOutput = z.object(deleteLeadOutputShape);

export type DeleteLeadToolInput = z.infer<typeof deleteLeadToolInput>;
export type DeleteLeadToolOutput = z.infer<typeof deleteLeadToolOutput>;
