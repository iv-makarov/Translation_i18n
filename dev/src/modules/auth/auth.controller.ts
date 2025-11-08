import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBody,
  ApiCookieAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import type { Response } from 'express';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import {
  ErrorResponseDto,
  LoginResponseDto,
  LogoutResponseDto,
  RefreshTokenResponseDto,
  RegisterResponseDto,
} from 'src/modules/auth/dto/response.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import type { RequestWithCookies } from './interfaces/request-with-cookies.interface';

@ApiTags('Authentication')
@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Register new user',
    description:
      'Creates a new user and organization. Sets JWT tokens in cookies.',
  })
  @ApiBody({
    type: RegisterDto,
    description: 'User registration data',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully registered',
    type: RegisterResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email must be an email',
          'password must be longer than or equal to 6 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 409,
    description: 'User with this email already exists',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 409,
        message: 'User with this email already exists',
        error: 'Conflict',
      },
    },
  })
  async register(@Body() registerDto: RegisterDto) {
    await this.authService.register(registerDto);

    return {
      statusCode: HttpStatus.OK,
      message: 'User registered successfully',
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticates user by email and password. Sets JWT tokens in cookies.',
  })
  @ApiBody({
    type: LoginDto,
    description: 'User login credentials',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged in',
    type: LoginResponseDto,
  })
  @ApiResponse({
    status: 400,
    description: 'Validation error',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 400,
        message: [
          'email must be an email',
          'password must be longer than or equal to 6 characters',
        ],
        error: 'Bad Request',
      },
    },
  })
  @ApiResponse({
    status: 401,
    description: 'Invalid credentials or user is inactive',
    type: ErrorResponseDto,
    schema: {
      examples: {
        userNotFound: {
          summary: 'User not found',
          value: {
            statusCode: 401,
            message: 'User not found',
            error: 'Unauthorized',
          },
        },
        incorrectPassword: {
          summary: 'Incorrect password',
          value: {
            statusCode: 401,
            message: 'Password is incorrect',
            error: 'Unauthorized',
          },
        },
        userDeactivated: {
          summary: 'Account deactivated',
          value: {
            statusCode: 401,
            message: 'User account is deactivated',
            error: 'Unauthorized',
          },
        },
      },
    },
  })
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { tokens } = await this.authService.login(loginDto);

    // Set cookies
    this.setCookies(res, tokens);
    return {
      statusCode: HttpStatus.OK,
      message: 'User logged in successfully',
    };
  }

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Refreshes access token using refresh token from cookies. Sets new tokens in cookies.',
  })
  @ApiResponse({
    status: 200,
    description: 'Token successfully refreshed',
    type: RefreshTokenResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'Refresh token missing, invalid or session expired',
    type: ErrorResponseDto,
    schema: {
      examples: {
        tokenNotFound: {
          summary: 'Refresh token not found',
          value: {
            statusCode: 401,
            message: 'Refresh token not found',
            error: 'Unauthorized',
          },
        },
        sessionNotFound: {
          summary: 'Session not found or revoked',
          value: {
            statusCode: 401,
            message: 'Session not found or revoked',
            error: 'Unauthorized',
          },
        },
        sessionExpired: {
          summary: 'Session expired',
          value: {
            statusCode: 401,
            message: 'Session expired',
            error: 'Unauthorized',
          },
        },
        invalidToken: {
          summary: 'Invalid refresh token',
          value: {
            statusCode: 401,
            message: 'Invalid refresh token',
            error: 'Unauthorized',
          },
        },
        userInactive: {
          summary: 'User inactive',
          value: {
            statusCode: 401,
            message: 'User not found or inactive',
            error: 'Unauthorized',
          },
        },
      },
    },
  })
  async refreshToken(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Extract refresh token from cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    // Update cookies
    this.setCookies(res, tokens);

    return {
      message: 'Token refreshed successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiCookieAuth()
  @ApiOperation({
    summary: 'User logout',
    description:
      'Logs out user, revokes session and clears token cookies. Requires authentication.',
  })
  @ApiResponse({
    status: 200,
    description: 'Successfully logged out',
    type: LogoutResponseDto,
  })
  @ApiResponse({
    status: 401,
    description: 'User not authenticated',
    type: ErrorResponseDto,
    schema: {
      example: {
        statusCode: 401,
        message: 'Unauthorized',
        error: 'Unauthorized',
      },
    },
  })
  async logout(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Extract tokens from cookies
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    await this.authService.logout(accessToken, refreshToken);

    // Clear cookies
    this.clearCookies(res);

    return {
      message: 'Logout successful',
    };
  }

  private setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    // Access token in httpOnly cookie (15 minutes)
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 minutes
      path: '/',
    });

    // Refresh token in httpOnly cookie (7 days)
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS in production
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      path: '/',
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }
}
