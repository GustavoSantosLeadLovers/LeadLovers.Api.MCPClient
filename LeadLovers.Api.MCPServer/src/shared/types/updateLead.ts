import { z } from 'zod';

import { updateLeadToolInput, updateLeadToolOutput } from 'shared/schemas/updateLead';

export type GetLeadsToolInput = z.infer<typeof updateLeadToolInput>;
export type GetLeadsToolOutput = z.infer<typeof updateLeadToolOutput>;
