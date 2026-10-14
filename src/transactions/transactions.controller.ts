import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { ZodValidationPipes } from '../pipes/zod-validation.pipe.js';
import { type FindTransactionDto, findTransactionSchema } from './dto/find-transaction.dts.js';
import { TransactionsService } from './transactions.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { createTransactionSchema, type CreateTransactionDto } from './dto/create-transaction.dto.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { type AuthUser } from '../types/express.js';

@Controller('transactions')
export class TransactionsController {
  constructor (private readonly transactionService: TransactionsService) {}
  @Get()
  allTransactions (@Query(new ZodValidationPipes(findTransactionSchema)) query: FindTransactionDto) {
    return this.transactionService.getAllTransactions(query)
  }
  @UseGuards(JwtAuthGuard)
  @Post('me')
  createMyTransaction(@Body(new ZodValidationPipes(createTransactionSchema)) createMyTrans: CreateTransactionDto, @CurrentUser() user: AuthUser) {
    return this.transactionService.createMyTransaction(createMyTrans, user.id)
  }
  @Post()
  createTransaction(@Body(new ZodValidationPipes(createTransactionSchema)) createTrans: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTrans)
  }
}
