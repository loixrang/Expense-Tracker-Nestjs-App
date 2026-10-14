import { BadRequestException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindTransactionDto } from './dto/find-transaction.dts.js';
import { TransactionsRepository } from './transactions.repository.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';

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
}
