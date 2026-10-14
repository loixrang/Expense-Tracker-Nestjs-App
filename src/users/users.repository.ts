import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { user } from '../db/schema/user.schema.js';
import { and, eq } from 'drizzle-orm';
import { registerUserDto } from '../auth/dto/register.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Request } from 'express';

@Injectable()
export class UsersRepository {
  constructor(private readonly dbService: DbService) {}

  async findByEmail(email: string) {
    const [result] = await this.dbService.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return result ?? null;
  }

  async create({ name, email, password }: registerUserDto) {
    const [createdUser] = await this.dbService.db
      .insert(user)
      .values({
        name: name,
        email: email,
        password: password,
      })
      .onConflictDoNothing({ target: user.email })
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
      });

    return createdUser ?? null;
  }

  async findAllUsers() {
    const allUsers = await this.dbService.db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user);
    return allUsers;
  }

  async findOneUser(id: number) {
    const singleUser = await this.dbService.db
      .select({
        id: user.id,
        name: user.name,
        email: user.email,
        createdAt: user.createdAt,
      })
      .from(user)
      .where(eq(user.id, id));

    return singleUser ?? null;
  }

  async updateUser(validatedUser: UpdateUserDto, id: number, req: Request) {
    const validUser = validatedUser;
    const updateUser = await this.dbService.db
      .update(user)
      .set({
        name: validUser.name,
        email: validUser.email,
      })
      .where(and(eq(user.id, id), eq(user.id, req.user!.id)))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
      });

    return updateUser ?? null;
  }
}
