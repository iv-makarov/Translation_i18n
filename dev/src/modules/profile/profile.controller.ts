import {
  Body,
  Controller,
  Get,
  Put,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ProfileService } from './profile.service';
import {
  GetProfileResponseDto,
  UpdatePasswordResponseDto,
  UpdateProfileResponseDto,
} from 'src/modules/profile/dto/response.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import type { RequestWithCookies } from 'src/modules/auth/interfaces/request-with-cookies.interface';
import { UpdateProfileDto } from 'src/modules/profile/dto/updateProfile.dto';
import UpdatePasswordDto from 'src/modules/profile/dto/updatePassword.dto';
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/modules/auth/dto/response.dto';

@Controller()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('getProfile')
  @ApiResponse({
    status: 200,
    description: 'Profile',
    type: GetProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: ErrorResponseDto,
  })
  async getProfile(
    @Req() req: RequestWithCookies,
  ): Promise<GetProfileResponseDto> {
    const accessToken = req.cookies?.accessToken;
    if (!accessToken) {
      throw new UnauthorizedException('Access token not found');
    }
    return (await this.profileService.getProfile(
      accessToken,
    )) as unknown as GetProfileResponseDto;
  }

  @Put('updateProfile')
  @ApiResponse({
    status: 200,
    description: 'Profile updated successfully',
    type: UpdateProfileResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: ErrorResponseDto,
  })
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UpdateProfileResponseDto> {
    return (await this.profileService.updateProfile(
      updateProfileDto,
    )) as unknown as UpdateProfileResponseDto;
  }

  @Put('updatePassword')
  @ApiResponse({
    status: 200,
    description: 'Password updated successfully',
    type: UpdatePasswordResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Unauthorized',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: ErrorResponseDto,
  })
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdatePasswordResponseDto> {
    return (await this.profileService.updatePassword(
      updatePasswordDto,
    )) as unknown as UpdatePasswordResponseDto;
  }
}
