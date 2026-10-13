import {
  BadRequestException,
  ConflictException,
  Injectable,
} from '@nestjs/common';
import { SignJWT, jwtVerify } from 'jose';
import * as argon2 from 'argon2';
import { CreateUserDto, createUserSchema } from './dto/create-user.dto.js';
import { UsersRepository } from './users.repository.js';

@Injectable()
export class UsersService {
  constructor(private readonly userRepository: UsersRepository) {}

  async create(createUser: CreateUserDto) {
    const userSafe = createUserSchema.safeParse(createUser);
    if (!userSafe.success) {
      throw new BadRequestException(userSafe.error.issues);
    }
    const parsedUser = userSafe.data;
    const existing = await this.userRepository.findByEmail(parsedUser.email);
    if (existing) {
      throw new ConflictException('Email already registered');
    }
    const passwordHash = await argon2.hash(parsedUser.password, {
      type: argon2.argon2id,
    });

    return await this.userRepository.create({
      name: parsedUser.name,
      email: parsedUser.email,
      password: passwordHash,
    });
  }

  async findAllUsers() {
    return await this.userRepository.findAllUsers();
  }

  async findOneUser(id: number) {
    return await this.userRepository.findOneUser(id);
  }
}
