import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller.js';
import { AuthService } from './auth.service.js';
import { UsersModule } from '../users/users.module.js';
import { DbModule } from '../db/db.module.js';
import { ConfigModule } from '@nestjs/config';
import { RolesGuard } from './guards/role.guard.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';

@Module({
  imports: [UsersModule, DbModule, ConfigModule],
  controllers: [AuthController],
  providers: [AuthService, RolesGuard, JwtAuthGuard],
  exports: [JwtAuthGuard, RolesGuard]
})
export class AuthModule {}
