import { z } from 'zod';

export const ReorderSchema = z.array(z.object({
  id: z.string(),
  order: z.number().int(),
}));

export type ReorderDto = z.infer<typeof ReorderSchema>;
