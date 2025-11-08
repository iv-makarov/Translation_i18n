import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsNotEmpty, IsString, Length } from 'class-validator';
import { UserRole } from 'db/entitis/Users';

export class CreateUserDto {
  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  @IsString({ message: 'Last name must be a string' })
  @IsNotEmpty({ message: 'Last name is required' })
  @Length(2, 20, {
    message: 'Last name must be between 2 and 20 characters',
  })
  lastName: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  @IsString({ message: 'First name must be a string' })
  @IsNotEmpty({ message: 'First name is required' })
  @Length(2, 20, {
    message: 'First name must be between 2 and 20 characters',
  })
  firstName: string;

  @ApiProperty({
    description: 'User email',
    example: 'john.doe@example.com',
  })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'password123',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 20, {
    message: 'Password must be between 6 and 20 characters',
  })
  password: string;

  @ApiProperty({
    description: 'User role',
    example: 'user',
  })
  @IsString({ message: 'Role must be a string' })
  @IsNotEmpty({ message: 'Role is required' })
  @IsEnum(UserRole, { message: 'Role must be a valid role' })
  role: UserRole;

  @ApiProperty({
    description: 'User organization id',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'Organization id must be a string' })
  @IsNotEmpty({ message: 'Organization id is required' })
  organizationId: string;
}
