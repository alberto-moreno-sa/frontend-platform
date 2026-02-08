import { z } from 'zod';

export const exportQuerySchema = z.object({
  format: z.enum(['csv', 'json']).default('json'),
  from: z.string().datetime().optional(),
  to: z.string().datetime().optional(),
  component: z.string().optional(),
  page: z.string().optional(),
});
