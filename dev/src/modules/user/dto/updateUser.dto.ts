import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { UserRole } from 'db/entitis/Users';

export class UpdateUserDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  @IsUUID(4, { message: 'User ID must be a valid UUID' })
  id: string;

  @ApiProperty({
    description: 'User Last Name',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(2, 20, {
    message: 'Last name must be between 2 and 20 characters',
  })
  lastName: string;

  @ApiProperty({
    description: 'User First Name',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Length(2, 20, {
    message: 'First name must be between 2 and 20 characters',
  })
  firstName: string;

  @ApiProperty({
    description: 'User Email',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User Role',
    example: 'user',
  })
  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role must be a valid role' })
  role: UserRole;

  @ApiProperty({
    description: 'User Is Active',
    example: true,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsNotEmpty({ message: 'Is active is required' })
  isActive: boolean;
}
