import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Put,
  Req,
  UseGuards,
} from '@nestjs/common';
import type { Request } from 'express';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/modules/user/dto/userCreate.dto';
import { UserService } from 'src/modules/user/user.service';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  async createUser(@Body() createUserDto: CreateUserDto) {
    return this.userService.createUser(createUserDto);
  }

  @Get('profile')
  async getProfile(@Req() req: RequestWithUser) {
    return this.userService.getUser(req.user?.id || '');
  }

  @Get(':id')
  async getUser(@Param('id') id: string) {
    return this.userService.getUser(id);
  }

  @Put(':id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    return this.userService.updateUser(id, updateUserDto);
  }

  @Put(':id/password')
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
