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
  success: z.boolean().describe('Indica se a operação foi bem-sucedida'),
  message: z.string().describe('Mensagem detalhada sobre o resultado da operação'),
  details: z.record(z.any()).describe('Detalhes adicionais sobre o lead deletado'),
  contextInfo: z.array(z.string()).describe('Informações contextuais adicionais sobre a operação'),
};

export const deleteLeadToolInput = z.object(deleteLeadInputShape);
export const deleteLeadToolOutput = z.object(deleteLeadOutputShape);
