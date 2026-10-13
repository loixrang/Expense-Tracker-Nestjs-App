import * as p from "drizzle-orm/pg-core"

export const user = p.pgTable("user", {
  id: p.integer().generatedAlwaysAsIdentity().notNull().primaryKey(),
  name: p.varchar({length: 256}).notNull(),
  email: p.varchar({length: 256}).notNull().unique(),
  password: p.varchar({length: 255}).notNull(),
  createdAt: p.timestamp({mode: 'string', withTimezone: true}).notNull().defaultNow(),
})