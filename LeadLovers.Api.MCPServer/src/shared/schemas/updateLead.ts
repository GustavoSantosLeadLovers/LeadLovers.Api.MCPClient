import { z } from 'zod';

export const updateLeadInputShape = {
  Name: z.string().min(2).max(100).optional().describe('Nome completo do lead (opcional)'),
  Email: z.string().email().max(100).describe('E-mail do lead (obrigatório)'),
  MachineCode: z
    .number()
    .min(0)
    .optional()
    .describe('Código da máquina onde o lead será criado (opcional)'),
  EmailSequenceCode: z
    .number()
    .min(0)
    .optional()
    .describe('Código da sequência de e-mail (opcional)'),
  SequenceLevelCode: z
    .number()
    .min(0)
    .optional()
    .describe('Código do nível da sequência de e-mail (opcional)'),
  Company: z.string().max(100).optional().describe('Empresa do lead (opcional)'),
  Phone: z.string().max(100).optional().describe('Telefone do lead (opcional)'),
  Photo: z.string().max(100).optional().describe('URL da foto (opcional)'),
  City: z.string().max(100).optional().describe('Cidade (opcional)'),
  State: z.string().max(100).optional().describe('Estado (opcional)'),
  Birthday: z.string().max(100).optional().describe('Data de nascimento (opcional)'),
  Gender: z.string().max(100).optional().describe('Gênero (opcional)'),
  Score: z.number().optional().describe('Pontuação do lead (opcional)'),
  Tag: z.number().min(0).optional().describe('Código da tag do lead (opcional)'),
  Source: z.string().max(100).optional().describe('Fonte do lead (opcional)'),
  Message: z.string().max(500).optional().describe('Mensagem do lead (opcional)'),
  Notes: z.string().max(500).optional().describe('Notas adicionais sobre o lead (opcional)'),
};

export const updateLeadOutputShape = {
  Id: z.number().describe('ID do lead atualizado'),
  Code: z.number().describe('Código do lead atualizado'),
  Email: z.string().email().describe('E-mail do lead atualizado'),
  Name: z.string().describe('Nome do lead atualizado'),
  Phone: z.string().nullable().describe('Telefone do lead atualizado'),
  Birthday: z.string().nullable().describe('Data de nascimento do lead atualizado'),
  Photo: z.string().nullable().describe('URL da foto do lead atualizado'),
  City: z.string().nullable().describe('Cidade do lead atualizado'),
  State: z.string().nullable().describe('Estado do lead atualizado'),
  Company: z.string().nullable().describe('Empresa do lead atualizado'),
  Gender: z.string().nullable().describe('Gênero do lead atualizado'),
};

export const updateLeadToolInput = z.object(updateLeadInputShape);
export const updateLeadToolOutput = z.object(updateLeadOutputShape);
