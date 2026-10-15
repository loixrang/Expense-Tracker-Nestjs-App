import { Controller, Get, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import { RolesGuard } from '../auth/guards/role.guard.js';
import { Role } from '../auth/roles/role.enum.js';
import { Roles } from '../decorators/roles.decorators.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import {type AuthUser } from '../types/express.js';
import { ReportsService } from './reports.service.js';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('reports')
export class ReportsController {
  constructor(private readonly reportService: ReportsService){}
  @Roles(Role.CUSTOMER)
  @Get('summary')
  getSummary(@CurrentUser() user: AuthUser) {
    return this.reportService.getSummary(user.id)
  }
}
