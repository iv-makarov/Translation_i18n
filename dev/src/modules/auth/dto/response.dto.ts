import { ApiProperty } from '@nestjs/swagger';

/**
 * Base DTO for error responses
 */
export class ErrorResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string | string[];

  @ApiProperty({
    description: 'Error name',
    example: 'Bad Request',
    required: false,
  })
  error?: string;
}

/**
 * DTO for registration response
 */
export class RegisterResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Success registration message',
    example: 'User registered successfully',
  })
  message: string;
}

/**
 * DTO for login response
 */
export class LoginResponseDto {
  @ApiProperty({
    description: 'HTTP status code',
    example: 200,
  })
  statusCode: number;

  @ApiProperty({
    description: 'Success login message',
    example: 'User logged in successfully',
  })
  message: string;
}

/**
 * DTO for refresh token response
 */
export class RefreshTokenResponseDto {
  @ApiProperty({
    description: 'Success token refresh message',
    example: 'Token refreshed successfully',
  })
  message: string;
}

/**
 * DTO for logout response
 */
export class LogoutResponseDto {
  @ApiProperty({
    description: 'Success logout message',
    example: 'Logout successful',
  })
  message: string;
}
