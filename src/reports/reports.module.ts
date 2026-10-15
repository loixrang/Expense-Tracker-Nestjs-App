import { Module } from '@nestjs/common';
import { ReportsController } from './reports.controller.js';
import { ReportsService } from './reports.service.js';
import { DbModule } from '../db/db.module.js';
import { ReportsRepository } from './reports.repository.js';

@Module({
  imports: [DbModule],
  controllers: [ReportsController],
  providers: [ReportsService, ReportsRepository]
})
export class ReportsModule {}
