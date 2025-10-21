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
import { UserService } from 'src/modules/user/user.service';
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
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    return this.userService.getProfile(req.user?.id || '');
  }

  @Put(':id')
  async updateProfile(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<RegisterDto>,
  ) {
    return this.userService.updateProfile(id, updateUserDto);
  }

  @Put('update-password/:id')
  async updateUserPassword(
    @Param('id') id: string,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.userService.updateUserPassword(
      id,
      body.oldPassword,
      body.newPassword,
    );
  }
}
