import { Body, Controller, Delete, Get, Param, ParseIntPipe, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { ZodValidationPipes } from '../pipes/zod-validation.pipe.js';
import { type FindTransactionDto, findTransactionSchema } from './dto/find-transaction.dts.js';
import { TransactionsService } from './transactions.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { createTransactionSchema, type CreateTransactionDto } from './dto/create-transaction.dto.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import { type AuthUser } from '../types/express.js';
import { type UpdateTransactionDto, updateTransactionSchema } from './dto/update-transaction.dto.js';
import { RolesGuard } from '../auth/guards/role.guard.js';
import { Roles } from '../decorators/roles.decorators.js';
import { Role } from '../auth/roles/role.enum.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('transactions')
export class TransactionsController {
  constructor (private readonly transactionService: TransactionsService) {}
  @Roles(Role.ADMIN, Role.STAFF)
  @Get()
  allTransactions (@Query(new ZodValidationPipes(findTransactionSchema)) query: FindTransactionDto) {
    return this.transactionService.getAllTransactions(query)
  }
  @Roles(Role.CUSTOMER)
  @Get('me')
  getMyTrans(@CurrentUser() user: AuthUser, @Query(new ZodValidationPipes(findTransactionSchema)) query: FindTransactionDto) {
    return this.transactionService.getAllTransactions(query, user.id)
  }
  @Roles(Role.ADMIN, Role.STAFF)
  @Get(':id')
  getTransById(@Param('id', ParseIntPipe) id: number, @Query(new ZodValidationPipes(findTransactionSchema)) query: FindTransactionDto) {
    return this.transactionService.getTransById(id)
  }

  @Roles(Role.CUSTOMER)
  @Get('me/:id')
  getMyTransById(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.transactionService.getTransById(id, user.id)
  }

  @Roles(Role.CUSTOMER)
  @Post('me')
  createMyTransaction(@Body(new ZodValidationPipes(createTransactionSchema)) createMyTrans: CreateTransactionDto, @CurrentUser() user: AuthUser) {
    return this.transactionService.createTransaction(createMyTrans, user.id)
  }
  
  @Roles(Role.CUSTOMER)
  @Patch('me/:id')
  updateMyCat(@Param('id', ParseIntPipe) id: number, @Body(new ZodValidationPipes(updateTransactionSchema)) updateTransactionDto: UpdateTransactionDto, @CurrentUser() user: AuthUser) {
    return this.transactionService.update(updateTransactionDto, id, user.id)
  }
  @Roles(Role.ADMIN, Role.STAFF)
  @Patch(':id')
  update(@Body(new ZodValidationPipes(updateTransactionSchema)) updateTransactionDto: UpdateTransactionDto, @Param('id', ParseIntPipe) id: number) {
    return this.transactionService.update(updateTransactionDto, id)
  }
  @Roles(Role.ADMIN, Role.STAFF)
  @Delete(':id')
  delete(@Param('id', ParseIntPipe) id: number) {
    return this.transactionService.delete(id)
  }
  @Roles(Role.CUSTOMER)
  @Delete('me/:id')
  deleteMyCat(@Param('id', ParseIntPipe) id: number, @CurrentUser() user: AuthUser) {
    return this.transactionService.deleteMyTrans(id, user.id)
  }
}
