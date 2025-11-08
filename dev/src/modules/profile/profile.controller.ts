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

@Controller()
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('getProfile')
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
  async updateProfile(
    @Body() updateProfileDto: UpdateProfileDto,
  ): Promise<UpdateProfileResponseDto> {
    return (await this.profileService.updateProfile(
      updateProfileDto,
    )) as unknown as UpdateProfileResponseDto;
  }

  @Put('updatePassword')
  async updatePassword(
    @Body() updatePasswordDto: UpdatePasswordDto,
  ): Promise<UpdatePasswordResponseDto> {
    return (await this.profileService.updatePassword(
      updatePasswordDto,
    )) as unknown as UpdatePasswordResponseDto;
  }
}
