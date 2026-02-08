import { z } from 'zod';

export const logoutSchema = z.object({
  refresh_token: z.string().min(1, 'Refresh token is required'),
});

export type LogoutInput = z.infer<typeof logoutSchema>;
