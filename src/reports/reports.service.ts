import { Injectable } from '@nestjs/common';
import { ReportsRepository } from './reports.repository.js';

@Injectable()
export class ReportsService {
  constructor (private readonly reportRepo: ReportsRepository) {}
  async getSummary (userId: number) {
    const summary = await this.reportRepo.summary(userId)
    return summary
  }
}
