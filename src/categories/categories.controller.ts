import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
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
  @Post('me')
  createCategory(@Body() createCategoryDto: CreateCategoryDto, @CurrentUser() user: AuthUser) {
    return this.categoryService.create(createCategoryDto, user.id)
  }

  @Get()
  getAllCategories(@Query('type') type?: CategoryEnumSchema) {
    return this.categoryService.getAllCategories(type)
  }

  @Get('me')
  getMyCat(@CurrentUser() user: AuthUser, @Query('type') type?: CategoryEnumSchema ) {
    return this.categoryService.getMyCategory(user.id,type)
  }

  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategory(id)
  }

  @Patch('me')
  updateMyCat(@Body() updateCategoryDto: UpdateCategoryDto, @CurrentUser() user: AuthUser) {
    return this.categoryService.update(updateCategoryDto, user.id, false)
  }
  @Patch(':id')
  update(@Body() updateCategoryDto: UpdateCategoryDto, @Param('id', ParseIntPipe) id: number) {
    return this.categoryService.update(updateCategoryDto, id, true)
  }
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.delete(id)
  }
  @Delete('me/:id')
  deleteMyCat(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.categoryService.deleteMyCat(id, user.id)
  }
}
