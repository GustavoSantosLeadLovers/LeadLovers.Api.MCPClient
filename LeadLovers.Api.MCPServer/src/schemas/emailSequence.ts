import z from 'zod';

export const getEmailSequencesSchema = z.object({
  machineCode: z.number().min(0),
});

export type GetEmailSequencesInput = z.infer<typeof getEmailSequencesSchema>;
