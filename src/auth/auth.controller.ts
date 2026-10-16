import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { registerUserSchema, type RegisterUserDto } from './dto/register.dto.js';
import { loginSchema, type LoginSchemaDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { AuthUser } from '../types/express.js';
import { Roles } from '../decorators/roles.decorators.js';
import { Role } from './roles/role.enum.js';
import { ZodValidationPipes } from '../pipes/zod-validation.pipe.js';
import { RolesGuard } from './guards/role.guard.js';


@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  create(@Body(new ZodValidationPipes(registerUserSchema)) createUser: RegisterUserDto) {
    return this.authService.create(createUser)
  }

  @Post("login")
  login(@Body(new ZodValidationPipes(loginSchema)) user: LoginSchemaDto) {
    return this.authService.login(user)
  }
  
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(Role.ADMIN)
  @Post('/staff')
  createStaff(@Body(new ZodValidationPipes(registerUserSchema)) staffDto: RegisterUserDto) {
    return this.authService.createStaff(staffDto)
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@CurrentUser() user: AuthUser) {
    return this.authService.getMe(user.id)
  }
}
