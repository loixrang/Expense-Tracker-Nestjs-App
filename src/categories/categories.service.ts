import { BadRequestException, Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CategoriesRepository } from './categories.repository.js';
import { CreateCategoryDto } from './dto/create-category.dto.js';
import { UpdateCategoryDto } from './dto/update-category.dto.js';
import { FindCategoryDto } from './dto/find-customer.dto.js';

@Injectable()
export class CategoriesService {
  constructor (private readonly categoryRepo: CategoriesRepository){}

  async getMyCategory(id: number, query: FindCategoryDto ) {
    if (query.type) {
      const findType = await this.categoryRepo.findMyType(query, id)
      if (!findType) {
        throw new NotFoundException("Category type not found")
      }
      return findType
    }
    return this.categoryRepo.getMyCategories(id)
  }
  async create(createCategoryDto: CreateCategoryDto, userId: number) {
    const createdCategory = await this.categoryRepo.create(createCategoryDto, userId)
    if (!createdCategory) 
      throw new InternalServerErrorException()

    return createdCategory
  }
  async getAllCategories (query: FindCategoryDto) {
    if (query.type) {
      const findType = await this.categoryRepo.findType(query)
      if (!findType) {
        throw new NotFoundException("Category type not found")
      }
      return findType
    }
    return this.categoryRepo.getCategories(query)
  }

  async getCategory(id: number) {
    const foundId = await this.categoryRepo.findId(id)
    if (!foundId) {
      throw new NotFoundException('Category id not found')
    }
    return foundId
  }
  async update(updateCategoryDto: UpdateCategoryDto, id: number, gen: boolean, userId?: number) {
      const updatedCategory = await this.categoryRepo.update(updateCategoryDto, id, gen, userId)
      if (!updatedCategory)
        throw new InternalServerErrorException("Can't update category")
      return updatedCategory
  }

  async deleteMyCat(id: number, userId: number) {
    const deleteCat = await this.categoryRepo.delete(id, false, userId)
    if (!deleteCat?.length) {
      throw new BadRequestException('Category not found')
    }
    return {
      message: "Deleted Succesfully",
      deleteCat
    }
  }

  async delete(id: number) {
    const deletedCat = await this.categoryRepo.delete(id, true)
    if (!deletedCat?.length) {
      throw new BadRequestException('Category not found')
    }
    return {
      message: "Deleted Succesfully",
      deletedCat
    }
  }
}
