import { Body, Controller, Delete, Get, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { type CreateCategoryDto } from './dto/create-category.dto.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { type AuthUser } from '../types/express.js';
import { CategoriesService } from './categories.service.js';
import {type UpdateCategoryDto } from './dto/update-category.dto.js';
import type {CategoryEnumSchema} from "./dto/create-category.dto.js"

@UseGuards(JwtAuthGuard)
@Controller('categories')
export class CategoriesController {
  constructor (private readonly categoryService: CategoriesService){}
  @Post()
  createCategory(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: AuthUser) {
    return this.categoryService.create(createCategoryDto, user.id)
  }

  @Get()
  getCategories(@Query('type') type?: CategoryEnumSchema) {
    return this.categoryService.getCategories(type)
  }

  @Patch()
  update(@Body() updateCategoryDto: UpdateCategoryDto, @CurrentUser() user: AuthUser) {
    return this.categoryService.update(updateCategoryDto, user.id)
  }

  @Delete()
  delete() {

  }
}
