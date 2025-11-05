import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

/**
 * DTO for user login
 */
export class LoginDto {
  @ApiProperty({
    type: String,
    required: true,
    description: 'User email address',
    example: 'john@example.com',
    format: 'email',
  })
  @IsString({ message: 'Email must be a string' })
  @IsEmail({}, { message: 'Email must be a valid email address' })
  @IsNotEmpty({ message: 'Email is required' })
  email: string;

  @ApiProperty({
    type: String,
    required: true,
    description: 'User password (6 to 20 characters)',
    example: 'password123',
    minLength: 6,
    maxLength: 20,
    format: 'password',
  })
  @IsString({ message: 'Password must be a string' })
  @IsNotEmpty({ message: 'Password is required' })
  @Length(6, 20, {
    message: 'Password must be between 6 and 20 characters',
  })
  password: string;
}
