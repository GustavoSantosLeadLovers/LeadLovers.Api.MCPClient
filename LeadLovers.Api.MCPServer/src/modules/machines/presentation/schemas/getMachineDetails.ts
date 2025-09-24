import { z } from 'zod';

export const getMachineDetailsInputShape = {
  machineCode: z.number().describe('Código da máquina'),
};

export const getMachineDetailsOutputShape = {
  Items: z.array(
    z.object({
      MachineCode: z.number().describe('Código da máquina'),
      MachineName: z.string().describe('Nome da máquina'),
      MachineImage: z.string().describe('URL da imagem da máquina'),
      Views: z.number().describe('Número de visualizações da máquina'),
      Leads: z.number().describe('Número de leads na máquina'),
    })
  ),
};

export const getMachineDetailsToolInput = z.object(getMachineDetailsInputShape);
export const getMachineDetailsToolOutput = z.object(getMachineDetailsOutputShape);

export type GetMachineDetailsToolInput = z.infer<typeof getMachineDetailsToolInput>;
export type GetMachineDetailsToolOutput = z.infer<typeof getMachineDetailsToolOutput>;
