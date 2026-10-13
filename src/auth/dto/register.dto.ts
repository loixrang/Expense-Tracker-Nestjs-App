import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from '../../db/schema/user.js';

export const registerSchema = createInsertSchema(user);

export type registerUserDto = z.infer<typeof registerSchema>;