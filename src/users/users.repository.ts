import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { user } from '../db/schema/user.schema.js';
import { eq } from 'drizzle-orm';
import { RegisterUserDto } from '../auth/dto/register.dto.js';
import { UpdateUserDto } from './dto/update-user.dto.js';
import { Role } from '../auth/roles/role.enum.js';

@Injectable()
export class UsersRepository {
  constructor(private readonly dbService: DbService) {}

  async findByEmail(email: string) {
    const [result] = await this.dbService.db
      .select()
      .from(user)
      .where(eq(user.email, email))
      .limit(1);

    return result
  }

  async createStaff(registerStaffDto: RegisterUserDto) {

    const [createdStaff] = await this.dbService.db
      .insert(user)
      .values({
        name: registerStaffDto.name,
        email: registerStaffDto.email,
        password: registerStaffDto.password,
        role: Role.STAFF
      })
      .onConflictDoNothing({ target: user.email })
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
      });

    return createdStaff
  }

  async create(registerUserDto: RegisterUserDto) {
    const [createdUser] = await this.dbService.db
      .insert(user)
      .values({
        name: registerUserDto.name,
        email: registerUserDto.email,
        password: registerUserDto.password,
      })
      .onConflictDoNothing({ target: user.email })
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
      });

    return createdUser
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

  async updateUser(validatedUser: UpdateUserDto, userId: number) {
    const validUser = validatedUser;
    const updateUser = await this.dbService.db
      .update(user)
      .set({
        name: validUser.name,
        email: validUser.email,
      })
      .where(eq(user.id, userId))
      .returning({
        id: user.id,
        name: user.name,
        email: user.email,
      });

    return updateUser ?? null;
  }
}
