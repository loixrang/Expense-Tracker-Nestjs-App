import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignJWT, jwtVerify } from 'jose';
import * as argon2 from 'argon2';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async findAllUsers() {
    return await this.userRepository.findAllUsers();
  }

  async findOneUser(id: number) {
    const singleUser = await this.userRepository.findOneUser(id);
    if (!singleUser.length) {
      throw new BadRequestException(`No user of ${id} found`)
    }
    return singleUser
  }
}
