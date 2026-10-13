import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import type { registerUserDto } from './dto/register.dto.js';
import type { LoginSchemaDto } from './dto/login.dto.js';
import { UsersRepository } from '../users/users.repository.js';
import { AuthService } from './auth.service.js';

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
}
