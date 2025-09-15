import { z } from 'zod';

export const moveCardSchema = z.object({
  boardId: z.coerce.number().int().positive().optional(),
  cardId: z.coerce.number().int().positive(),
  columnId: z.coerce.number().int().positive(),
  position: z.coerce.number().int().min(0).default(0),
});

export type MoveCardInput = z.infer<typeof moveCardSchema>;
