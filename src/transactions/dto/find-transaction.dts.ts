import z from "zod"
import { categoryEnum } from "../../db/schema/category.schema.js"

export const findTransactionSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
  type: z.enum(categoryEnum.enumValues).optional()
})

export type FindTransactionDto = z.infer<typeof findTransactionSchema>