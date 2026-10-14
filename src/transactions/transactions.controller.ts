import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
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
  @Get(':id')
  getTransById(@Param('id', ParseIntPipe) id: number, @Query(new ZodValidationPipes(findTransactionSchema)) query: FindTransactionDto) {
    return this.transactionService.getTransById(id)
  }
  @UseGuards(JwtAuthGuard)
  @Get('me/:id')
  getMyTransById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.transactionService.getTransById(id, user.id)
  }
  @UseGuards(JwtAuthGuard)
  @Post('me')
  createMyTransaction(@Body(new ZodValidationPipes(createTransactionSchema)) createMyTrans: CreateTransactionDto, @CurrentUser() user: AuthUser) {
    return this.transactionService.createTransaction(createMyTrans, true, user.id)
  }
  @Post()
  createTransaction(@Body(new ZodValidationPipes(createTransactionSchema)) createTrans: CreateTransactionDto) {
    return this.transactionService.createTransaction(createTrans, false)
  }
}
