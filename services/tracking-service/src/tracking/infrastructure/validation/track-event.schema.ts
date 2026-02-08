import { z } from 'zod';

export const trackEventSchema = z.object({
  componentName: z.string().min(1, 'componentName is required'),
  variant: z.string().min(1, 'variant is required'),
  action: z.enum(['click', 'hover', 'focus', 'blur', 'submit', 'view', 'scroll', 'change']),
  timestamp: z.string().datetime({ message: 'Invalid timestamp format. Expected ISO 8601.' }),
  sessionId: z.string().min(1, 'sessionId is required'),
  pageUrl: z.string().min(1, 'pageUrl is required'),
  pageTitle: z.string().nullish().default(null),
  referrer: z.string().nullish().default(null),
  viewport: z
    .object({
      width: z.number().int().min(0).default(0),
      height: z.number().int().min(0).default(0),
    })
    .default({ width: 0, height: 0 }),
  userAgent: z.string().nullish().default(null),
  language: z.string().nullish().default(null),
  metadata: z.record(z.unknown()).default({}),
});
