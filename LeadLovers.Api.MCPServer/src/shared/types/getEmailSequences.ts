import z from 'zod';

import {
  getEmailSequencesToolInput,
  getEmailSequencesToolOutput,
} from 'shared/schemas/getEmailSequences';

export type GetEmailSequencesInput = z.infer<typeof getEmailSequencesToolInput>;
export type GetEmailSequencesOutput = z.infer<typeof getEmailSequencesToolOutput>;
