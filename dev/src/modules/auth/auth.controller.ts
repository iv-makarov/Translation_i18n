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
import type { Response } from 'express';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';
import { JwtAuthGuard } from 'src/modules/auth/guards/jwt-auth.guard';
import { AuthService } from './auth.service';
import { Public } from './decorators/public.decorator';
import type { RequestWithCookies } from './interfaces/request-with-cookies.interface';

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

  @Public()
  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  async refreshToken(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Извлекаем refresh token из cookies
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
      throw new UnauthorizedException('Refresh token not found');
    }

    const tokens = await this.authService.refreshToken(refreshToken);

    // Обновляем куки
    this.setCookies(res, tokens);

    return {
      message: 'Token refreshed successfully',
    };
  }

  @UseGuards(JwtAuthGuard)
  @Post('logout')
  @HttpCode(HttpStatus.OK)
  async logout(
    @Req() req: RequestWithCookies,
    @Res({ passthrough: true }) res: Response,
  ) {
    // Извлекаем токены из cookies
    const accessToken = req.cookies.accessToken;
    const refreshToken = req.cookies.refreshToken;

    await this.authService.logout(accessToken, refreshToken);

    // Очищаем куки
    this.clearCookies(res);

    return {
      message: 'Logout successful',
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
