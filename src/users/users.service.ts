import { Injectable, NotFoundException } from '@nestjs/common';
import { user, UserSchema, UpdateUserSchema } from '../db/schema.js';
import { DbService } from '../db/db.service.js';
import { eq } from 'drizzle-orm';
import { ROLE } from '../types/category.js';

@Injectable()
export class UsersService {
  constructor (private readonly dbService: DbService) {}
  async findAll() {
    return this.dbService.db.select().from(user)
  }
}
