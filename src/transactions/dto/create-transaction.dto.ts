import { createInsertSchema } from 'drizzle-zod';
import { z } from 'zod';
import { transactions } from '../../db/schema/transaction.schema.js';

export const createTransactionSchema = createInsertSchema(transactions);

export type CreateTransactionDto = z.infer<typeof createTransactionSchema>;
