import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Length } from 'class-validator';

export class UpdateProfileDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
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
}
