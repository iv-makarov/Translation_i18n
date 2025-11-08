import { ApiProperty } from '@nestjs/swagger';
import { Users } from 'db/entitis/Users';

export class GetUsersResponseDto {
  @ApiProperty({
    description: 'Users',
    type: () => [Users],
  })
  users: Omit<Users, 'passwordHash'>[];
}

export class CreateUserResponseDto {
  @ApiProperty({
    description: 'Success create user message',
    example: 'User created successfully',
  })
  message: string;
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}

export class UpdateUserResponseDto {
  @ApiProperty({
    description: 'Success update user message',
    example: 'User updated successfully',
  })
  message: string;
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}

export class DeleteUserResponseDto {
  @ApiProperty({
    description: 'Success delete user message',
    example: 'User deleted successfully',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}
