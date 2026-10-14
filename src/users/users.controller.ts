import { Body, Controller, Delete, Get, Param, Patch, Post, Query, ParseIntPipe, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { UsersService } from './users.service.js';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard.js';
import type { UpdateUserDto } from './dto/update-user.dto.js';
import type { Request } from 'express';

@Controller('users')
export class UsersController {
  constructor(private readonly userService: UsersService) {}

  @Get()
  findALl() {
    return this.userService.findAllUsers()
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findOneUser(+id);
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  update(@Param('id') id:string, @Body() updateUserDto: UpdateUserDto, @Req() req: Request) {
    return this.userService.updateUser(+id, updateUserDto, req)
  }
}
