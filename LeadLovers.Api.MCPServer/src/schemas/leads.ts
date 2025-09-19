import { z } from 'zod';

export const getLeadsSchema = z.object({
  page: z.number().min(0),
  startDate: z.string().max(100).optional(),
  endDate: z.string().max(100).optional(),
});

export const createLeadSchema = z.object({
  Name: z.string().min(2).max(100),
  Email: z.string().email().max(100),
  MachineCode: z.number().min(0),
  EmailSequenceCode: z.number().min(0),
  SequenceLevelCode: z.number().min(0),
  Company: z.string().max(100).optional(),
  Phone: z.string().max(100).optional(),
  Photo: z.string().max(100).optional(),
  City: z.string().max(100).optional(),
  State: z.string().max(100).optional(),
  Birthday: z.string().max(100).optional(),
  Gender: z.string().max(100).optional(),
  Score: z.number().min(0).optional(),
  Tag: z.number().min(0).optional(),
  Source: z.string().max(100).optional(),
  Message: z.string().max(100).optional(),
  Notes: z.string().max(100).optional(),
  DynamicFields: z
    .array(
      z.object({
        Id: z.number().min(0).optional(),
        Value: z.string().max(100).optional(),
      })
    )
    .optional(),
  AdditionalInfo: z
    .object({
      AbandonedCartUrl: z.string().max(100).optional(),
    })
    .optional(),
  Parameters: z
    .object({
      UTMSource: z.string().max(100).optional(),
      UTMMedium: z.string().max(100).optional(),
      UTMCampaign: z.string().max(100).optional(),
      UTMTerm: z.string().max(100).optional(),
      UTMContent: z.string().max(100).optional(),
    })
    .optional(),
});

export const updateLeadSchema = createLeadSchema
  .extend({
    Email: z.string().email().max(100),
  })
  .extend({
    MachineCode: z.number().max(100).optional(),
    EmailSequenceCode: z.number().min(0).optional(),
    SequenceLevelCode: z.number().min(0).optional(),
  });

export const deleteLeadSchema = z.object({
  machineCode: z.number().min(1),
  sequenceCode: z.number().min(1),
  phone: z.string().max(100).optional(),
  email: z.string().max(100).optional(),
});

export type GetLeadsInput = z.infer<typeof getLeadsSchema>;
export type CreateLeadInput = z.infer<typeof createLeadSchema>;
export type UpdateLeadInput = z.infer<typeof updateLeadSchema>;
export type DeleteLeadInput = z.infer<typeof deleteLeadSchema>;
