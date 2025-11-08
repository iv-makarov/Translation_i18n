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
import { ApiResponse } from '@nestjs/swagger';
import { ErrorResponseDto } from 'src/modules/auth/dto/response.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { CreateUserDto } from 'src/modules/user/dto/createUser.dto';
import {
  CreateUserResponseDto,
  DeleteUserResponseDto,
  GetUsersResponseDto,
  UpdateUserResponseDto,
} from 'src/modules/user/dto/response.dto';
import { UpdateUserDto } from 'src/modules/user/dto/updateUser.dto';
import { UserService } from 'src/modules/user/user.service';
@Controller()
@UseGuards(JwtAuthGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('getUsers')
  @ApiResponse({
    status: 200,
    description: 'Users',
    type: GetUsersResponseDto,
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
  async getUsers(): Promise<GetUsersResponseDto> {
    return (await this.userService.getUsers()) as unknown as GetUsersResponseDto;
  }

  @Post('createUser')
  @ApiResponse({
    status: 200,
    description: 'User created successfully',
    type: CreateUserResponseDto,
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
  async createUser(
    @Body() createUserDto: CreateUserDto,
  ): Promise<CreateUserResponseDto> {
    return (await this.userService.createUser(
      createUserDto,
    )) as unknown as CreateUserResponseDto;
  }

  @Put('updateUser/:id')
  @ApiResponse({
    status: 200,
    description: 'User updated successfully',
    type: UpdateUserResponseDto,
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
  @ApiResponse({
    status: 200,
    description: 'User deleted successfully',
    type: DeleteUserResponseDto,
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
  async deleteUser(@Param('id') id: string): Promise<DeleteUserResponseDto> {
    return (await this.userService.deleteUser(
      id,
    )) as unknown as DeleteUserResponseDto;
  }
}
