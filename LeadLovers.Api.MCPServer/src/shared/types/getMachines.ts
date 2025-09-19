import { z } from 'zod';

import { getMachinesToolInput, getMachinesToolOutput } from '../schemas/getMachines';

export type GetMachinesToolInput = z.infer<typeof getMachinesToolInput>;
export type GetMachinesToolOutput = z.infer<typeof getMachinesToolOutput>;
