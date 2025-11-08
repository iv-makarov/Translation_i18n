import { EntityManager } from '@mikro-orm/core';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { hash } from 'bcryptjs';
import { Session } from 'db/entitis/Session';
import { Users } from 'db/entitis/Users';
import {
  GetProfileResponseDto,
  UpdatePasswordResponseDto,
  UpdateProfileResponseDto,
} from 'src/modules/profile/dto/response.dto';
import UpdatePasswordDto from 'src/modules/profile/dto/updatePassword.dto';
import { UpdateProfileDto } from 'src/modules/profile/dto/updateProfile.dto';

@Injectable()
export class ProfileService {
  constructor(private readonly em: EntityManager) {}

  async getProfile(accessToken: string): Promise<GetProfileResponseDto> {
    const session = await this.em.findOne(
      Session,
      { accessToken },
      { populate: ['user'] },
    );
    if (!session) {
      throw new UnauthorizedException('Session not found');
    }

    const { passwordHash: _passwordHash, ...userWithoutPassword } =
      session.user as Users;
    void _passwordHash;
    return userWithoutPassword as unknown as GetProfileResponseDto;
  }

  async updateProfile(
    updateProfileDto: UpdateProfileDto,
  ): Promise<UpdateProfileResponseDto> {
    const user = await this.em.findOne(Users, { id: updateProfileDto.id });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    user.updatedAt = new Date();
    user.firstName = updateProfileDto.firstName;
    user.lastName = updateProfileDto.lastName;
    user.email = updateProfileDto.email;
    await this.em.persistAndFlush(user);
    return {
      message: 'Profile updated successfully',
      statusCode: HttpStatus.OK,
    };
  }

  async updatePassword(
    updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdatePasswordResponseDto> {
    const user = await this.em.findOne<Users>(Users, {
      id: updatePasswordDto.id,
    });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const newPasswordHash = await hash(updatePasswordDto.newPassword, 12);
    user.passwordHash = newPasswordHash;
    user.updatedAt = new Date();
    await this.em.persistAndFlush(user);
    return {
      message: 'Password updated successfully',
      statusCode: HttpStatus.OK,
    };
  }
}
