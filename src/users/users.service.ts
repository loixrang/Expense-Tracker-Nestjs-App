import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UsersRepository } from './users.repository.js';
import { UpdateUserDto, updateUserSchema } from './dto/update-user.dto.js';

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

  async updateUser(id: number, updatedUserDto: UpdateUserDto, userId: number) {
    const updateSafe = updateUserSchema.safeParse(updatedUserDto)
    if (!updateSafe.success) {
      throw new BadRequestException(updateSafe.error.issues)
    }
    const validated = updateSafe.data
    if (validated.email) {
      const existing = await this.userRepository.findByEmail(validated.email);
      if (existing) {
        throw new ConflictException('Email already registered');
      }
    }
    const completed = await this.userRepository.updateUser(validated, id, userId)
    if (!completed.length) {
      throw new UnauthorizedException(`Can't edit user of id: ${id}`)
    }
    return completed
  }
}
