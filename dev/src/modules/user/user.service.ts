import { EntityManager } from '@mikro-orm/core';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { Session } from 'db/entitis/Session';
import { Users } from 'db/entitis/Users';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

@Injectable()
export class UserService {
  constructor(private readonly em: EntityManager) {}

  async getProfile(accessToken: string): Promise<Omit<Users, 'passwordHash'>> {
    const session = await this.em.findOne(
      Session,
      { accessToken },
      { populate: ['user'] },
    );
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    // Возвращаем пользователя без пароля
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = session.user;
    return userWithoutPassword;
  }

  async updateProfile(
    id: string,
    updateUserDto: Partial<RegisterDto>,
  ): Promise<Omit<Users, 'passwordHash'>> {
    const user = await this.em.findOne(Users, { id, isActive: true });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Если обновляется email, проверяем уникальность
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existingUser = await this.em.findOne(Users, {
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

    // Возвращаем пользователя без пароля
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutPassword } = user;
    return userWithoutPassword;
  }

  async updateUserPassword(
    id: string,
    oldPassword: string,
    newPassword: string,
  ) {
    const user = await this.em.findOne(Users, { id, isActive: true });
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
