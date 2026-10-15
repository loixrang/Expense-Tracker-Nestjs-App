import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { createCategorySchema, type CreateCategoryDto } from './dto/create-category.dto.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { type AuthUser } from '../types/express.js';
import { CategoriesService } from './categories.service.js';
import {updateCategorySchema, type UpdateCategoryDto } from './dto/update-category.dto.js';
import { ZodValidationPipes } from '../pipes/zod-validation.pipe.js';
import { type FindCategoryDto, findCategorySchema } from './dto/find-customer.dto.js';
import { RolesGuard } from '../auth/guards/role.guard.js';
import { Roles } from '../decorators/roles.decorators.js';
import { Role } from '../auth/roles/role.enum.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('categories')
export class CategoriesController {
  constructor (private readonly categoryService: CategoriesService){}
  @Roles(Role.CUSTOMER)
  @Post('me')
  createCategory(@Body(new ZodValidationPipes(createCategorySchema)) createCategoryDto: CreateCategoryDto, @CurrentUser() user: AuthUser) {
    return this.categoryService.create(createCategoryDto, user.id)
  }

  @Get()
  getAllCategories(@Query(new ZodValidationPipes(findCategorySchema)) query: FindCategoryDto) {
    return this.categoryService.getAllCategories(query)
  }

  @Get('me')
  getMyCat(@CurrentUser() user: AuthUser, @Query(new ZodValidationPipes(findCategorySchema)) query: FindCategoryDto ) {
    return this.categoryService.getMyCategory(user.id, query)
  }

  @Get(':id')
  getCategory(@Param('id', ParseIntPipe) id: number) {
    return this.categoryService.getCategory(id)
  }

  @Patch('me/:id')
  updateMyCat(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipes(updateCategorySchema)) updateCategoryDto: UpdateCategoryDto, @CurrentUser() user: AuthUser) {
    return this.categoryService.update(updateCategoryDto, id, false, user.id)
  }
  @Patch(':id')
  update(@Body(new ZodValidationPipes(updateCategorySchema)) updateCategoryDto: UpdateCategoryDto, @Param('id', ParseIntPipe) id: number) {
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
