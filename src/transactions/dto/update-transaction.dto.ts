import { createTransactionSchema } from "./create-transaction.dto.js";
import z from "zod";

export const updateTransactionSchema = createTransactionSchema.partial()
export type UpdateTransactionDto = z.infer<typeof updateTransactionSchema>