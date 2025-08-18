import { EntityManager } from '@mikro-orm/core';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { User } from 'db/entitis/User';
import { Session } from 'db/entitis/Session';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly em: EntityManager) {}

  async getProfile(id: string) {
    const userId = await this.em.findOne(Session, { id });
    console.log(userId);
    if (!userId) {
      throw new UnauthorizedException('User not found');
    }
    return userId;
  }

  async updateProfile(id: string, updateUserDto: Partial<RegisterDto>) {
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
    const isOldPasswordValid = await bcrypt.compare(
      oldPassword,
      user.passwordHash,
    );
    if (!isOldPasswordValid) {
      throw new UnauthorizedException('Invalid old password');
    }

    // Хешируем новый пароль
    user.passwordHash = await bcrypt.hash(newPassword, 12);
    user.updatedAt = new Date();
    await this.em.persistAndFlush(user);
    return { message: 'Password updated successfully' };
  }
}
