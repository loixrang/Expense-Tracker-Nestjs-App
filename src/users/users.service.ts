import { BadRequestException, ConflictException, HttpException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { eq } from 'drizzle-orm';
import { SignJWT, jwtVerify } from 'jose';
import * as argon2 from 'argon2';
import { ROLE } from '../types/category.js';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto.js';
import { user } from '../db/schema/user.schema.js';

@Injectable()
export class UsersService {
  constructor(private readonly dbService: DbService) {}

  async create(createUser: CreateUserDto) {
    const userSafe = createUserSchema.safeParse(createUser);
    if (!userSafe.success) {
      throw new BadRequestException(userSafe.error.issues);
    }
    try {
      const { name, email, password } = userSafe.data;
      const passwordHash = await argon2.hash(password, {
        type: argon2.argon2id,
      });
      const [createdUser] = await this.dbService.db
        .insert(user)
        .values({
          name: name,
          email: email,
          password: passwordHash,
        })
        .onConflictDoNothing({target: user.email})
        .returning({
          id: user.id,
          name: user.name,
          email: user.email,
        });

        if (!createdUser) {
          throw new ConflictException("User already exists");
        }

        return createdUser
    } catch (error) {
      if (error instanceof HttpException) {
      throw error;
    }
      console.error(error);
      throw new InternalServerErrorException();
    }
  }

  async findAllUsers() {
    return await this.dbService.db.select().from(user);
  }

  async findOneUser(id: number) {
    return await this.dbService.db
      .select()
      .from(user)
      .where(eq(user.id, id))
      .limit(1);
  }
}
