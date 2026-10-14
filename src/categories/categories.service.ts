import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository.js';
import { CreateCategoryDto, createCategorySchema } from './dto/create-category.dto.js';

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
  async getCategories () {
    return this.categoryRepo.getCategories()
  }
}
