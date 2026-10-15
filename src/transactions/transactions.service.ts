import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindTransactionDto } from './dto/find-transaction.dts.js';
import { TransactionsRepository } from './transactions.repository.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';
import { UpdateTransactionDto } from './dto/update-transaction.dto.js';

@Injectable()
export class TransactionsService {
  constructor (private readonly transactRepo: TransactionsRepository) {}
  async getAllTransactions(query: FindTransactionDto) {
    return await this.transactRepo.getALlTransactions(query)
  }

  async getTransById(id: number, userId?: number) {
    const found = await this.transactRepo.getTransById(id, userId)
    if (!found) 
      throw new BadRequestException("Transaction not found")
    return found
  }

  async createTransaction(createTransDto: CreateTransactionDto, user: boolean, id?: number) {
    if (id && user === true) {
      const create = await this.transactRepo.createTransaction(createTransDto, user, id)
    if (!create)
      throw new InternalServerErrorException("Can't complete task")
    return create
    }
    const create = await this.transactRepo.createTransaction(createTransDto, user)
    if (!create)
      throw new InternalServerErrorException("Can't complete task")
    return create
  }
  async update(updateTransactionDto: UpdateTransactionDto, id: number, userId?: number) {
        const updatedTransaction = await this.transactRepo.update(updateTransactionDto, id, userId)
        if (!updatedTransaction)
          throw new InternalServerErrorException("Can't update category")
        return updatedTransaction
    }
  
  async deleteMyTrans(id: number, userId: number) {
    const deleteTrans = await this.transactRepo.delete(id, userId)
    if (!deleteTrans) {
      throw new BadRequestException('Category not found')
    }
    return {
      message: "Deleted Succesfully",
      deleteTrans
    }
  }

  async delete(id: number) {
    const deletedTrans = await this.transactRepo.delete(id)
    if (!deletedTrans) {
      throw new BadRequestException('Category not found')
    }
    return {
      message: "Deleted Succesfully",
      deletedTrans
    }
  }
}
