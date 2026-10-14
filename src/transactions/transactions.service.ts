import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { FindTransactionDto } from './dto/find-transaction.dts.js';
import { TransactionsRepository } from './transactions.repository.js';
import { CreateTransactionDto } from './dto/create-transaction.dto.js';

@Injectable()
export class TransactionsService {
  constructor (private readonly transactRepo: TransactionsRepository) {}
  async getAllTransactions(query: FindTransactionDto) {
    return await this.transactRepo.getALlTransactions(query)
  }

  async createTransaction(createTransDto: CreateTransactionDto) {
    const create = await this.transactRepo.createTransaction(createTransDto, false)
    if (!create)
      throw new InternalServerErrorException("Can't complete task")
    return create
  }

  async createMyTransaction(createTransDto: CreateTransactionDto, id: number) {
    const create = await this.transactRepo.createTransaction(createTransDto, true, id)
    if (!create)
      throw new InternalServerErrorException("Can't complete task")
    return create
  }
}
