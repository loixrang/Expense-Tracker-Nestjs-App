import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from '../../db/schema/user.schema.js';
import { Role } from '../roles/role.enum.js';

export const registerUserSchema = createInsertSchema(user).safeExtend({
  name: z.string().trim().min(1).max(100),
  email: z.string().trim().toLowerCase().pipe(z.email()),
  password: z.string().min(8).max(50),
});

export type RegisterUserDto = z.infer<typeof registerUserSchema>;
