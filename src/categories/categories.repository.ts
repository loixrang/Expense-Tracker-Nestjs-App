import { Controller, Get } from '@nestjs/common';
import { DbService } from '../db/db.service.js';
import { categories } from '../db/schema/category.schema.js';

@Controller('categories')
export class CategoriesRepository {
  constructor(private readonly database: DbService) {}
  @Get()
  getCategories() {
    return this.database.db.select().from(categories);
  }
}
