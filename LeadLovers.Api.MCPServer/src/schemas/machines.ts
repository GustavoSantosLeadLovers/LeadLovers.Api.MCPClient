import { z } from 'zod';

export const getMachinesSchema = z.object({
  page: z.number().min(0).optional(),
  registers: z.number().min(1).optional().default(10),
  details: z.number().min(0).optional(),
  types: z.string().min(1).max(255).optional(),
});

export const getMachineDetailsSchema = z.object({
  machineCode: z.number().min(1),
});

export type GetMachinesInput = z.infer<typeof getMachinesSchema>;
export type GetMachineDetailsInput = z.infer<typeof getMachineDetailsSchema>;
