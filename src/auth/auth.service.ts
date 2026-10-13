import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersRepository } from '../users/users.repository.js';
import { registerSchema, registerUserDto } from './dto/register.dto.js';
import * as argon2 from "argon2"
import { loginSchema, LoginSchemaDto } from './dto/login.dto.js';
import { SignJWT } from 'jose';

@Injectable()
export class AuthService {
  constructor(private readonly userRepository: UsersRepository) {}

  async generateToken(userId: number) {
    const secretValue = process.env.JWT_SECRET;

    if (!secretValue || secretValue.length < 32) {
      throw new Error("JWT_SECRET must contain a random secret");
    }
    const secret = new TextEncoder().encode(secretValue)
    return new SignJWT({}).setProtectedHeader({alg: 'HS256'}).setSubject(String(userId)).setIssuedAt().setExpirationTime('1h').sign(secret)
  }

  async create(createUser: registerUserDto) {
    const userSafe = registerSchema.safeParse(createUser);
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

  async login (loginUser: LoginSchemaDto) {
    const loginSafe = loginSchema.safeParse(loginUser)
    if (!loginSafe.success) {
      throw new BadRequestException(loginSafe.error.issues);
    }
    const sucess = loginSafe.data
    const existing = await this.userRepository.findByEmail(sucess.email)
    if (!existing || !await argon2.verify(existing.password, sucess.password)) {
      throw new UnauthorizedException('User not registered');
    }
    
    const token = await this.generateToken(existing.id)

    return {user: {
      name: existing.name,
      email: existing.email
    }, token}
  }
}
