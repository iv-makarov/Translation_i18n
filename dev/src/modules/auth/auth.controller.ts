import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import type { Request, Response } from 'express';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
}

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Public()
  @Post('register')
  @HttpCode(HttpStatus.OK)
  async register(
    @Body() registerDto: RegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.register(registerDto);

    // Устанавливаем куки
    this.setCookies(res, tokens);

    return {
      message: 'User registered successfully',
      user,
    };
  }

  @Public()
  @Post('login')
  @HttpCode(HttpStatus.OK)
  async login(
    @Body() loginDto: LoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { user, tokens } = await this.authService.login(loginDto);

    // Устанавливаем куки
    this.setCookies(res, tokens);

    return {
      user,
    };
  }

  // @Post('refresh')
  // @HttpCode(HttpStatus.OK)
  // async refreshToken(
  //   @Body() refreshTokenDto: RefreshTokenDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   const tokens = await this.authService.refreshToken(refreshTokenDto);

  //   // Обновляем куки
  //   this.setCookies(res, tokens);

  //   return {
  //     message: 'Token refreshed successfully',
  //     tokens,
  //   };
  // }

  // @UseGuards(JwtAuthGuard)
  // @Post('logout')
  // @HttpCode(HttpStatus.OK)
  // async logout(
  //   @Body() logoutDto: LogoutDto,
  //   @Res({ passthrough: true }) res: Response,
  // ) {
  //   await this.authService.logout(logoutDto);

  //   // Очищаем куки
  //   this.clearCookies(res);

  //   return {
  //     message: 'Logout successful',
  //   };
  // }

  @UseGuards(JwtAuthGuard)
  @Get('profile')
  getProfile(@Req() req: RequestWithUser) {
    return {
      message: 'Profile retrieved successfully',
      user: req.user,
    };
  }

  @Public()
  @Get('health')
  health() {
    return {
      message: 'Auth service is healthy',
      timestamp: new Date().toISOString(),
    };
  }

  private setCookies(
    res: Response,
    tokens: { accessToken: string; refreshToken: string },
  ) {
    // Access token в httpOnly куки (15 минут)
    res.cookie('accessToken', tokens.accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS в продакшене
      sameSite: 'strict',
      maxAge: 15 * 60 * 1000, // 15 минут
      path: '/',
    });

    // Refresh token в httpOnly куки (7 дней)
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production', // HTTPS в продакшене
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 дней
      path: '/',
    });
  }

  private clearCookies(res: Response) {
    res.clearCookie('accessToken', { path: '/' });
    res.clearCookie('refreshToken', { path: '/' });
  }
}
