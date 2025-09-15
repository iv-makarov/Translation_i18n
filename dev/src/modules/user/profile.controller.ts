import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { ProfileService } from 'src/modules/user/profile.service';
import { RegisterDto } from '../auth/dto/register.dto';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    return this.profileService.getProfile(req.user?.id || '');
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<RegisterDto>,
  ) {
    return this.profileService.updateProfile(id, updateUserDto);
  }

  @Put('update-password/:id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.profileService.updateUserPassword(
      id,
      body.oldPassword,
      body.newPassword,
    );
  }
}
