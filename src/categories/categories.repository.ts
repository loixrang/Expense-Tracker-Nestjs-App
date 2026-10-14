import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { categories } from '../db/schema/category.schema.js';
import { CategoryEnumSchema, CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { eq } from 'drizzle-orm';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly database: DbService) {}
  async getCategories() {
    return this.database.db.select().from(categories);
  }
  async findType(type: CategoryEnumSchema) {
    const catType = await this.database.db.select().from(categories).where(eq(categories.type, type))
    return catType ?? null
  }
  async create(parsedCategory: CreateCategoryDto, id: number) {
    const createCat = await this.database.db.insert(categories).values({
      name: parsedCategory.name,
      type: parsedCategory.type,
      userId: id
    }).returning()

    return createCat ?? null
  }
  async update(validatedUpdate: UpdateCategoryDto, userId: number) {
    const updateCat = await this.database.db.update(categories).set({
      name: validatedUpdate.name,
      type: validatedUpdate.type
    }).where(eq(categories.userId, userId)).returning()

    return updateCat ?? null
  }
}
