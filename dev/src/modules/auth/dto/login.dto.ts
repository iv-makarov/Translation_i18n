import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class LoginDto {
  // Email
  @IsString()
  @IsEmail()
  @IsNotEmpty()
  @ApiProperty({
    type: String,
    required: true,
    description: 'Email',
    example: 'john@example.com',
  })
  email: string;

  // Password
  @IsString()
  @IsNotEmpty()
  @Length(6, 20)
  @ApiProperty({
    type: String,
    required: true,
    description: 'Password',
    example: 'password123',
  })
  password: string;
}
