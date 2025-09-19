import { z } from 'zod';

import { getLeadsToolInput, getLeadsToolOutput } from 'shared/schemas/getLeads';

export type GetLeadsToolInput = z.infer<typeof getLeadsToolInput>;
export type GetLeadsToolOutput = z.infer<typeof getLeadsToolOutput>;
