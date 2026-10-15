import * as p from 'drizzle-orm/pg-core';
import { user } from './user.schema.js';
import { categories, categoryEnum } from './category.schema.js';

export const transactions = p.pgTable('transactions', {
  id: p.integer().generatedAlwaysAsIdentity().primaryKey(),
  userId: p.integer().references(() => user.id),
  categoryId: p.integer().references(() => categories.id).notNull(),
  amount: p.integer().notNull(),
  description: p.varchar({ length: 255 }),
  occuredAt: p
    .timestamp({ mode: 'string', withTimezone: true })
    .notNull()
    .defaultNow(),
  createdAt: p
    .timestamp({ mode: 'string', withTimezone: true })
    .notNull()
    .defaultNow(),
});
