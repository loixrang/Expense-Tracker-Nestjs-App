import * as p from 'drizzle-orm/pg-core';
import { user } from './user.js';

export const categoryEnum = p.pgEnum('category', ['income', 'expense']);

export const categories = p.pgTable('categories', {
  id: p.integer().generatedAlwaysAsIdentity().notNull().primaryKey(),
  userId: p.integer().references(() => user.id),
  name: p.varchar({ length: 255 }).notNull(),
  type: categoryEnum().notNull(),
  createdAt: p
    .timestamp({ mode: 'string', withTimezone: true })
    .notNull()
    .defaultNow(),
});
