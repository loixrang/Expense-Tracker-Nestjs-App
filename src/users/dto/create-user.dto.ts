import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { user } from '../../db/schema/user.schema.js';

export const createUserSchema = createInsertSchema(user)

export type CreateUserDto = z.infer<typeof createUserSchema>;