import { z } from 'zod';

export const exportQuerySchema = z.object({
  format: z.enum(['csv', 'json']).default('json'),
  from: z.string().datetime({ offset: false, message: 'Invalid date format. Expected ISO 8601 in UTC (e.g. 2024-01-01T00:00:00Z).' }).optional(),
  to: z.string().datetime({ offset: false, message: 'Invalid date format. Expected ISO 8601 in UTC (e.g. 2024-01-01T00:00:00Z).' }).optional(),
  component: z.string().optional(),
  page: z.string().optional(),
});
