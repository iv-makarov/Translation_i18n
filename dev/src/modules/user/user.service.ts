import { EntityManager } from '@mikro-orm/core';
import { HttpStatus, Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Users } from 'db/entitis/Users';
import { CreateUserDto } from 'src/modules/user/dto/createUser.dto';
import {
  CreateUserResponseDto,
  DeleteUserResponseDto,
  GetUsersResponseDto,
  UpdateUserResponseDto,
} from 'src/modules/user/dto/response.dto';
import { UpdateUserDto } from 'src/modules/user/dto/updateUser.dto';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async getUsers(): Promise<GetUsersResponseDto> {
    const users = await this.em.find(Users, {});

    return {
      users: users.map((user) => {
        const { passwordHash: _passwordHash, ...rest } = user;
        void _passwordHash;
        return rest;
      }),
    };
  }

  async createUser(
    createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    const { password, ...rest } = createUserDto;

    const user = this.em.create(Users, {
      ...rest,
      passwordHash: await bcrypt.hash(password, 12),
      isActive: true,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      projectIds: [] as string[],
    });
    await this.em.persistAndFlush(user);

    return {
      message: 'User created successfully',
      statusCode: HttpStatus.CREATED,
    };
  }

  async updateUser(
    id: string,
    updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    const user = await this.em.findOne(Users, { id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    user.updatedAt = new Date();
    user.firstName = updateUserDto.firstName;
    user.lastName = updateUserDto.lastName;
    user.email = updateUserDto.email;
    user.role = updateUserDto.role;
    user.isActive = updateUserDto.isActive;

    await this.em.persistAndFlush(user);

    return {
      message: 'User updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async deleteUser(id: string): Promise<DeleteUserResponseDto> {
    const user = await this.em.findOne(Users, { id });
    if (!user) {
      throw new NotFoundException('User not found');
    }
    await this.em.removeAndFlush(user);

    return {
      message: 'User deleted successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
