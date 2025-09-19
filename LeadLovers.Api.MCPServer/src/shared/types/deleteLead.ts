import { z } from 'zod';

import { deleteLeadToolInput, deleteLeadToolOutput } from 'shared/schemas/deleteLead';

export type DeleteLeadToolInput = z.infer<typeof deleteLeadToolInput>;
export type DeleteLeadToolOutput = z.infer<typeof deleteLeadToolOutput>;
