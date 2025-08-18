import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class RegisterDto {
  // Last name
  @ApiProperty({ description: 'Last name of the user', example: 'Doe' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  lastName: string;

  // First name
  @ApiProperty({ description: 'First name of the user', example: 'John' })
  @IsString()
  @IsNotEmpty()
  @Length(2, 20)
  firstName: string;

  // Email
  @ApiProperty({
    description: 'Email of the user',
    example: 'john.doe@example.com',
  })
  @IsEmail()
  @IsNotEmpty()
  email: string;

  // Password
  @ApiProperty({ description: 'Password of the user', example: 'password' })
  @IsString()
  @Length(6, 20)
  @IsNotEmpty()
  password: string;
}
