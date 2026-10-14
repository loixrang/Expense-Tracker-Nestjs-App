import { Body, Controller, Get, Param, Patch, ParseIntPipe, UseGuards } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import { CurrentUser } from '../decorators/current-user.decorator.js';
import type { AuthUser } from '../types/express.js';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findALl() {
    return this.userService.findAllUsers()
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findOneUser(id);
  }

  @Patch('/me')
  update(@Body() updateUserDto: UpdateUserDto, @CurrentUser() user: AuthUser) {
    return this.userService.updateUser(updateUserDto, user.id)
  }
}
