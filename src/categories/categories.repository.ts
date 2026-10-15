import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { categories } from '../db/schema/category.schema.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { and, eq, SQL } from 'drizzle-orm';
import { FindCategoryDto } from './dto/find-customer.dto.js';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly database: DbService) {}
  async getMyCategories(userId: number) {
    const [myCategory] = await this.database.db.select().from(categories).where(eq(categories.userId, userId)).orderBy(categories.id)
    return myCategory
  }
  async getCategories(query: FindCategoryDto) {
    const [allCategory] = await this.database.db.select().from(categories).orderBy(categories.id).limit(query.limit).offset(query.page);

    return allCategory
  }
  async findType(query: FindCategoryDto) {
    const conditions: SQL[] = []
    if (query.type !== undefined) {
      conditions.push(eq(categories.type, query.type))
    }
      const catType = await this.database.db.select().from(categories).where(and(...conditions)).limit(query.limit).offset((query.page - 1) * query.limit).orderBy(categories.id)
      return catType
  }
  async findMyType(query: FindCategoryDto, id: number) {
    const conditions: SQL[] = [eq(categories.userId, id)]
    if (query.type !== undefined) {
      conditions.push(eq(categories.type, query.type))
    }
      const catType = await this.database.db.select().from(categories).where(and(...conditions)).limit(query.limit).offset((query.page - 1) * query.limit).orderBy(categories.id)
      return catType
  }
  async findId(id: number) {
    const [findCatId] = await this.database.db.select().from(categories).where(eq(categories.id, id))
    return findCatId
  }
  async create(parsedCategory: CreateCategoryDto, UserId: number) {
    const [createCat] = await this.database.db.insert(categories).values({
      name: parsedCategory.name,
      type: parsedCategory.type,
      userId: UserId
    }).returning()

    return createCat
  }
  async update(validatedUpdate: UpdateCategoryDto, id: number, gen: boolean, userId?: number) {
    if (gen === true) {
      const updateCat = await this.database.db.update(categories).set({
        name: validatedUpdate.name,
        type: validatedUpdate.type
      }).where(eq(categories.id, id)).returning()

      return updateCat ?? null
    }
    if (userId && gen === false) {
      const updateCat = await this.database.db.update(categories).set({
        name: validatedUpdate.name,
        type: validatedUpdate.type
      }).where(and(eq(categories.userId, userId), eq(categories.id, id))).returning()
  
      return updateCat ?? null
    }
  }
  async delete(id: number, gen: boolean, userId?: number ) {
    if (gen === true) {
      const deleteCat = await this.database.db.delete(categories).where(eq(categories.id, id)).returning()
      return deleteCat
    }
    if (userId && gen === false) {
      const deleteCat = await this.database.db.delete(categories).where(and(eq(categories.id, id), eq(categories.userId, userId))).returning()
        return deleteCat
    }
  }
}
