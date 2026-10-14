import { Injectable } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { categories } from '../db/schema/category.schema.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';

@Injectable()
export class CategoriesRepository {
  constructor(private readonly database: DbService) {}
  async getCategories() {
    return this.database.db.select().from(categories);
  }
  async create(parsedCategory: CreateCategoryDto, id: number) {
    const createCat = await this.database.db.insert(categories).values({
      name: parsedCategory.name,
      type: parsedCategory.type,
      userId: id
    }).returning()

    return createCat ?? null
  }
}
