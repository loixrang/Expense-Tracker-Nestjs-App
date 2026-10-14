import { Module } from '@nestjs/common';
import { TransactionsService } from './transactions.service.js';
import { TransactionsController } from './transactions.controller.js';
import { TransactionsRepository } from './transactions.repository.js';
import { DbModule } from '../db/db.module.js';

@Module({
  imports: [DbModule],
  providers: [TransactionsService, TransactionsRepository],
  controllers: [TransactionsController]
})
export class TransactionsModule {}
