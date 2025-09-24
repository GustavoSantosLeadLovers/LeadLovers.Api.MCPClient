import { z } from 'zod';

export const getMachinesInputShape = {
  page: z.number().optional().default(1).describe('Número da página para paginação (padrão: 1)'),
  registers: z
    .number()
    .optional()
    .default(10)
    .describe('Número de registros por página (padrão: 10)'),
  details: z
    .number()
    .optional()
    .default(0)
    .describe('Incluir detalhes das máquinas (0 ou 1, padrão: 0)'),
  types: z.string().optional().describe('Tipos de máquinas a serem filtradas (opcional)'),
};

export const getMachinesOutputShape = {
  Items: z
    .array(
      z.object({
        MachineCode: z.number().describe('Código da máquina'),
        MachineName: z.string().describe('Nome da máquina'),
        MachineImage: z.string().describe('URL da imagem da máquina'),
        Views: z.number().describe('Número de visualizações da máquina'),
        Leads: z.number().describe('Número de leads na máquina'),
      })
    )
    .describe('Lista de máquinas'),
  CurrentPage: z.number().describe('Página atual da listagem'),
  Registers: z.number().describe('Número total de registros'),
};

export const getMachinesToolInput = z.object(getMachinesInputShape);
export const getMachinesToolOutput = z.object(getMachinesOutputShape);

export type GetMachinesToolInput = z.infer<typeof getMachinesToolInput>;
export type GetMachinesToolOutput = z.infer<typeof getMachinesToolOutput>;
