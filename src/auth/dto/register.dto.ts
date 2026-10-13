import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from '../../db/schema/user.js';

export const registerSchema = createInsertSchema(user).safeExtend({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(8).max(50),
});

export type registerUserDto = z.infer<typeof registerSchema>;