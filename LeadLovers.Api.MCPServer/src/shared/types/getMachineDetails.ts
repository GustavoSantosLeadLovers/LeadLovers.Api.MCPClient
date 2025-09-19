import { z } from 'zod';

import {
  getMachineDetailsToolInput,
  getMachineDetailsToolOutput,
} from 'shared/schemas/getMachineDetails';

export type GetMachineDetailsToolInput = z.infer<typeof getMachineDetailsToolInput>;
export type GetMachineDetailsToolOutput = z.infer<typeof getMachineDetailsToolOutput>;
