import { Module } from '@nestjs/common';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { DbModule } from './db/db.module.js';
import { UsersModule } from './users/users.module.js';
import { TransactionsModule } from './transactions/transactions.module.js';
import { CategoriesModule } from './categories/categories.module.js';
import { AuthModule } from './auth/auth.module.js';
import {ConfigModule} from "@nestjs/config"
import { ReportsModule } from './reports/reports.module.js';

@Module({
  controllers: [AppController],
  providers: [AppService],
  imports: [DbModule, UsersModule, TransactionsModule, CategoriesModule, AuthModule, ConfigModule.forRoot({
    isGlobal: true
  }), ReportsModule],
})
export class AppModule {}
