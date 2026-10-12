import * as p from "drizzle-orm/pg-core"

export const user = p.pgTable("user", {
  id: p.integer("id").generatedAlwaysAsIdentity().notNull(),
  name: p.varchar({length: 256}).notNull(),
  email: p.varchar({length: 256}).notNull().unique()
})

export const category = p.pgEnum("category", ["bills", "transport", "food"])

export const userExpenses = p.pgTable("expenses", {
  id: p.integer().generatedAlwaysAsIdentity().notNull(),
  userId: p.integer("user_id").references(() => user.id),
  title: p.varchar({length: 256}).notNull(),
  price: p.integer().notNull(),
  category: category().notNull()
})