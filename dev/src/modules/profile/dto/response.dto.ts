import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsDate,
  IsEmail,
  IsEnum,
  IsNotEmpty,
  IsString,
  IsUUID,
  Length,
} from 'class-validator';
import { UserRole } from 'db/entitis/Users';

export class GetProfileResponseDto {
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
  role: string;

  @ApiProperty({
    description: 'User Is Active',
    example: true,
  })
  @IsBoolean({ message: 'Is active must be a boolean' })
  @IsNotEmpty({ message: 'Is active is required' })
  isActive: boolean;

  @ApiProperty({
    description: 'User Is Email Verified',
    example: true,
  })
  @IsBoolean({ message: 'Is email verified must be a boolean' })
  @IsNotEmpty({ message: 'Is email verified is required' })
  isEmailVerified: boolean;

  @ApiProperty({
    description: 'User Created At',
    example: '2021-01-01T00:00:00.000Z',
  })
  @IsDate({ message: 'Created at must be a date' })
  @IsNotEmpty({ message: 'Created at is required' })
  createdAt: Date;

  @ApiProperty({
    description: 'User Updated At',
    example: '2021-01-01T00:00:00.000Z',
  })
  @IsDate({ message: 'Updated at must be a date' })
  @IsNotEmpty({ message: 'Updated at is required' })
  updatedAt: Date;
}

export class UpdateProfileResponseDto {
  @ApiProperty({
    description: 'Success update profile message',
    example: 'Profile updated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}

export class UpdatePasswordResponseDto {
  @ApiProperty({
    description: 'Success update password message',
    example: 'Password updated successfully',
  })
  message: string;

  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;
}
