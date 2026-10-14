import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { type CreateCategoryDto } from './dto/create-category.dto.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { type AuthUser } from '../types/express.js';
import { CategoriesService } from './categories.service.js';

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor (private readonly categoryService: CategoriesService){}
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: AuthUser) {
    return this.categoryService.create(createCategoryDto, user.id)
  }

  @Get()
  getCategories() {
    return this.categoryService.getCategories()
  }
}
