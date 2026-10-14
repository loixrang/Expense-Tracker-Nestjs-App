import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository.js';
import { categoryEnumSchema, CategoryEnumSchema, CreateCategoryDto, createCategorySchema } from './dto/create-category.dto.js';
import { UpdateCategoryDto, updateCategorySchema } from './dto/update-category.dto.js';

@Injectable()
export class CategoriesService {
  constructor (private readonly categoryRepo: CategoriesRepository){}
  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    const categorySafe = createCategorySchema.safeParse(createCategoryDto);
    if (!categorySafe.success) 
      throw new BadRequestException(categorySafe.error.issues)
    const parsedCategory = categorySafe.data;
    const createdCategory = await this.categoryRepo.create(parsedCategory, userId)
    if (!createdCategory) 
      throw new InternalServerErrorException("Can't complete task")

    return createdCategory
  }
  async getCategories (type?: CategoryEnumSchema) {
    if (type) {
      const typeSafe = categoryEnumSchema.safeParse(type)
      if (!typeSafe.success) 
      throw new BadRequestException(typeSafe.error.issues)
      const parsedCategory = typeSafe.data;
      const findType = await this.categoryRepo.findType(parsedCategory)
      if (!findType) {
        throw new NotFoundException("Category type not found")
      }
      return findType
    }
    return this.categoryRepo.getCategories()
  }

  async update(updateCategoryDto: UpdateCategoryDto, id: number) {
    const updateSafe = updateCategorySchema.safeParse(updateCategoryDto)
    if (!updateSafe.success)
      throw new BadRequestException(updateSafe.error.issues)
    const validatedUpdate = updateSafe.data
    const updatedCategory = await this.categoryRepo.update(validatedUpdate, id)
    if (!updatedCategory)
      throw new InternalServerErrorException("Can't update category")
    return updatedCategory
  }
}
