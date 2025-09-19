import { z } from 'zod';

import { createLeadToolInput, createLeadToolOutput } from 'shared/schemas/createLead';

export type CreateLeadToolInput = z.infer<typeof createLeadToolInput>;
export type CreateLeadToolOutput = z.infer<typeof createLeadToolOutput>;
