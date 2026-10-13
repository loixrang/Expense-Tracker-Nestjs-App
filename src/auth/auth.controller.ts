import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service.js';
import type { registerUserDto } from './dto/register.dto.js';
import type { LoginSchemaDto } from './dto/login.dto.js';

@Controller('auth')
export class AuthController {
  constructor(private readonly userService: UsersService) {}
  @Post('/register')
  create(@Body() createUser: registerUserDto) {
    return this.userService.create(createUser);
  }

  @Post("/login")
  login(@Body() user: LoginSchemaDto) {
    
  }
}
