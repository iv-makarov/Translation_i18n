import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { UserService } from 'src/modules/user/user.service';
import {
  CreateUserResponseDto,
  DeleteUserResponseDto,
  GetUsersResponseDto,
  UpdateUserResponseDto,
} from 'src/modules/user/dto/response.dto';
import { CreateUserDto } from 'src/modules/user/dto/createUser.dto';
import { UpdateUserDto } from 'src/modules/user/dto/updateUser.dto';
@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getUsers')
  async getUsers(): Promise<GetUsersResponseDto> {
    return (await this.userService.getUsers()) as unknown as GetUsersResponseDto;
  }

  @Post('createUser')
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return (await this.userService.createUser(
      createUserDto,
    )) as unknown as CreateUserResponseDto;
  }

  @Put('updateUser/:id')
  async updateUser(
    @Param('id') id: string,
    @Body() updateUserDto: UpdateUserDto,
  ): Promise<UpdateUserResponseDto> {
    return (await this.userService.updateUser(
      id,
      updateUserDto,
    )) as unknown as UpdateUserResponseDto;
  }

  @Delete('deleteUser/:id')
  async deleteUser(@Param('id') id: string): Promise<DeleteUserResponseDto> {
    return (await this.userService.deleteUser(
      id,
    )) as unknown as DeleteUserResponseDto;
  }
}
