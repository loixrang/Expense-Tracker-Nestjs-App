import { Controller, Get, UseGuards } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor (private readonly categoryRepo: CategoriesRepository){}
  @Get()
  getCategories() {
    return this.categoryRepo.getCategories()
  }
}
