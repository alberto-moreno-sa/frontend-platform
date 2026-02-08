import { z } from 'zod';

export const statsQuerySchema = z.object({
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  component: z.string().optional(),
  page: z.string().optional(),
});
