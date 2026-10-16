import * as argon2 from 'argon2'
import { db } from '../db/client.js';
import { user } from '../db/schema/user.schema.js';
import { eq } from 'drizzle-orm';
import { Role } from '../auth/roles/role.enum.js';

async function bootstrapAdmin() {
  const name = process.env.ADMIN_NAME;
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!name || !email || !password) {
    throw new Error("Missing Admin bootstrap credentials")
  }

  const normalizedEmail = email.trim().toLowerCase();

  const existing = await db.select({id: user.id}).from(user).where(eq(user.email, normalizedEmail)).limit(1)

  if (existing.length > 0) {
    throw new Error("Bootsrap email already exists")
  }

  const passwordHash = await argon2.hash(password, {
    type: argon2.argon2id
  })

  const [admin] = await db.insert(user).values({
    name: name,
    email: normalizedEmail,
    password: passwordHash,
    role: Role.ADMIN
  }).onConflictDoNothing({target: user.email})
  .returning({
    id: user.name,
    email: user.email,
    role: user.role,
  })

  if (!admin) {
    throw new Error('Admin creation conflict')
  }

  console.log('Admin account created: ', admin)
}

bootstrapAdmin().catch((error) => {
  console.error('Admin bootstrap failed: ', error);
  process.exitCode = 1
})