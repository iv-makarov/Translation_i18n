import { EntityManager } from '@mikro-orm/core';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from 'db/entitis/User';
import { CreateUserDto } from 'src/modules/user/dto/userCreate.dto';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async createUser(createUserDto: CreateUserDto) {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.em.findOne(User, {
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(createUserDto.password, 12);

    const user = this.em.create(User, {
      ...createUserDto,
      password: hashedPassword,
      role: 'user',
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    await this.em.persistAndFlush(user);
    return user;
  }

  async getUser(id: string) {
    const user = await this.em.findOne(User, { id, isActive: true });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    return user;
  }

  async getUserByEmail(email: string) {
    const user = await this.em.findOne(User, { email, isActive: true });
    return user;
  }

  async updateUser(id: string, updateUserDto: Partial<CreateUserDto>) {
    const user = await this.em.findOne(User, { id, isActive: true });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Если обновляется email, проверяем уникальность
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.em.findOne(User, {
        email: updateUserDto.email,
      });
      if (existingUser) {
        throw new ConflictException('User with this email already exists');
      }
    }

    user.updatedAt = new Date();
    if (updateUserDto.firstName) user.firstName = updateUserDto.firstName;
    if (updateUserDto.lastName) user.lastName = updateUserDto.lastName;
    if (updateUserDto.email) user.email = updateUserDto.email;

    await this.em.persistAndFlush(user);
    return user;
  }

  async updateUserPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.em.findOne(User, { id, isActive: true });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Проверяем старый пароль
    const isOldPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    // Хешируем новый пароль
    user.password = await bcrypt.hash(newPassword, 12);
    user.updatedAt = new Date();
    await this.em.persistAndFlush(user);
    return { message: 'Password updated successfully' };
  }

  async deactivateUser(id: string) {
    const user = await this.em.findOne(User, { id, isActive: true });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.isActive = false;
    user.updatedAt = new Date();
    await this.em.persistAndFlush(user);
    return { message: 'User deactivated successfully' };
  }

  async activateUser(id: string) {
    const user = await this.em.findOne(User, { id, isActive: false });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    user.isActive = true;
    user.updatedAt = new Date();
    await this.em.persistAndFlush(user);
    return { message: 'User activated successfully' };
  }
}
