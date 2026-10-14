import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { categories, categoryEnum } from '../../db/schema/category.schema.js';

export const createCategorySchema = createInsertSchema(categories).safeExtend({
  name: z.string().trim().min(1).max(100)
});
export const categoryEnumSchema = z.enum(categoryEnum.enumValues)

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;
export type CategoryEnumSchema = z.infer<typeof categoryEnumSchema>