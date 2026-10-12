import * as p from "drizzle-orm/pg-core"
import { createInsertSchema } from "drizzle-zod"
import z from "zod"

export const user = p.pgTable("user", {
  id: p.integer().generatedAlwaysAsIdentity().notNull().primaryKey(),
  name: p.varchar({length: 256}).notNull(),
  email: p.varchar({length: 256}).notNull().unique(),
  passwordHash: p.varchar({length: 255}).notNull(),
  createdAt: p.timestamp({mode: 'string', withTimezone: true}).notNull().defaultNow(),
})

export const userSchema = createInsertSchema(user)
export type UserSchema = z.infer<typeof userSchema>
export type UpdateUserSchema = Partial<UserSchema>

export const categoryEnum = p.pgEnum("category", ["income", "expense"])

export const categories = p.pgTable("categories", {
  id: p.integer().generatedAlwaysAsIdentity().notNull().primaryKey(),
  userId: p.integer().references(() => user.id),
  name: p.varchar({length: 255}).notNull(),
  type: categoryEnum().notNull(),
  createdAt: p.timestamp({mode: 'string', withTimezone: true}).notNull().defaultNow(),
})

export const categorySchema = createInsertSchema(categories)
export type CategorySchema = z.infer<typeof categorySchema>

export const transactions = p.pgTable("transactions", {
  id: p.integer().generatedAlwaysAsIdentity().primaryKey(),
  userId: p.integer().references(() => user.id),
  categoryId: p.integer().references(() => categories.id),
  amount: p.integer().notNull(),
  type: categoryEnum().notNull(),
  description: p.varchar({length: 255}),
  occuredAt: p.timestamp({mode: 'string', withTimezone: true}).notNull().defaultNow(),
  createdAt: p.timestamp({mode: 'string', withTimezone: true}).notNull().defaultNow(),
})

export const transactionSchema = createInsertSchema(transactions)
export type TransactionSchema = z.infer<typeof transactionSchema>