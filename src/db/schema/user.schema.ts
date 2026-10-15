import * as p from "drizzle-orm/pg-core"
import { ROLES } from "../../auth/roles/role.enum.js";

export const userRole = p.pgEnum("user_role", ROLES);

export const user = p.pgTable("user", {
  id: p.integer().generatedAlwaysAsIdentity().notNull().primaryKey(),
  name: p.varchar({length: 256}).notNull(),
  email: p.varchar({length: 256}).notNull().unique(),
  role: userRole().notNull().default(ROLES.CUSTOMER),
  password: p.varchar({length: 255}).notNull(),
  createdAt: p.timestamp({mode: 'string', withTimezone: true}).notNull().defaultNow(),
})