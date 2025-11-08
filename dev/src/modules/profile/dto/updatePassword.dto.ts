import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsString, Length } from 'class-validator';

export default class UpdatePasswordDto {
  @ApiProperty({
    description: 'User ID',
    example: '123e4567-e89b-12d3-a456-426614174000',
  })
  @IsString({ message: 'User ID must be a string' })
  @IsNotEmpty({ message: 'User ID is required' })
  id: string;

  @ApiProperty({
    description: 'Old Password',
    example: 'password123',
  })
  @IsString({ message: 'Old password must be a string' })
  @IsNotEmpty({ message: 'Old password is required' })
  @Length(6, 20, {
    message: 'Old password must be between 6 and 20 characters',
  })
  oldPassword: string;

  @ApiProperty({
    description: 'New Password',
    example: 'password456',
  })
  @IsString({ message: 'New password must be a string' })
  @IsNotEmpty({ message: 'New password is required' })
  @Length(6, 20, {
    message: 'New password must be between 6 and 20 characters',
  })
  newPassword: string;

  @ApiProperty({
    description: 'Confirm New Password',
    example: 'password456',
  })
  @IsString({ message: 'Confirm new password must be a string' })
  @IsNotEmpty({ message: 'Confirm new password is required' })
  @Length(6, 20, {
    message: 'Confirm new password must be between 6 and 20 characters',
  })
  confirmNewPassword: string;
}
