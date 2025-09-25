import { z } from 'zod';

export const createLeadInputShape = {
  Name: z.string().min(2).max(100).describe('Nome completo do lead (obrigatório)'),
  Email: z.string().email().max(100).describe('E-mail do lead (obrigatório)'),
  MachineCode: z
    .number()
    .min(0)
    .describe('Código da máquina onde o lead será criado (obrigatório)'),
  EmailSequenceCode: z.number().min(0).describe('Código da sequência de e-mail (obrigatório)'),
  SequenceLevelCode: z
    .number()
    .min(0)
    .describe('Código do nível da sequência de e-mail (obrigatório)'),
  Company: z.string().max(100).optional().describe('Empresa do lead (opcional)'),
  Phone: z.string().max(100).optional().describe('Telefone do lead (opcional)'),
  Photo: z.string().max(100).optional().describe('URL da foto (opcional)'),
  City: z.string().max(100).optional().describe('Cidade (opcional)'),
  State: z.string().max(100).optional().describe('Estado (opcional)'),
  Birthday: z.string().max(100).optional().describe('Data de nascimento (opcional)'),
  Gender: z.string().max(100).optional().describe('Gênero (opcional)'),
  Score: z.number().min(0).optional().describe('Pontuação do lead (opcional)'),
  Tag: z.number().min(0).optional().describe('Código da tag (opcional)'),
  Source: z.string().max(100).optional().describe('Fonte do lead (opcional)'),
  Message: z.string().max(500).optional().describe('Mensagem do lead (opcional)'),
  Notes: z.string().max(500).optional().describe('Notas adicionais (opcional)'),
};

export const createLeadOutputShape = {
  Message: z.string().describe('Mensagem de confirmação da criação do lead'),
};

export const createLeadToolInput = z.object(createLeadInputShape);
export const createLeadToolOutput = z.object(createLeadOutputShape);

export type CreateLeadToolInput = z.infer<typeof createLeadToolInput>;
export type CreateLeadToolOutput = z.infer<typeof createLeadToolOutput>;
