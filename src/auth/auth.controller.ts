import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import type { registerUserDto } from './dto/register.dto.js';
import type { LoginSchemaDto } from './dto/login.dto.js';
import { AuthService } from './auth.service.js';
import { JwtAuthGuard } from './guards/jwt-auth.guard.js';
import { type Request } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}
  @Post('register')
  create(@Body() createUser: registerUserDto) {
    return this.authService.create(createUser)
  }

  @Post("login")
  login(@Body() user: LoginSchemaDto) {
    return this.authService.login(user)
  }

  @UseGuards(JwtAuthGuard)
  @Get("me")
  getMe(@Req() req: Request) {
    return this.authService.getMe(req)
  }
}
