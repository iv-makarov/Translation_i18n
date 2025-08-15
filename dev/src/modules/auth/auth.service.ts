import { EntityManager } from '@mikro-orm/core';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { User, UserRole } from 'db/entitis/User';
import { jwtConfig, refreshTokenConfig } from 'src/config/jwt.config';
import {
  LoginDto,
  LogoutDto,
  RefreshTokenDto,
  RegisterDto,
} from 'src/modules/user/dto/auth.dto';

export interface Tokens {
  accessToken: string;
  refreshToken: string;
}

export interface JwtPayload {
  sub: string;
  email: string;
  role: string;
}

@Injectable()
export class AuthService {
  constructor(
    private readonly em: EntityManager,
    private readonly jwtService: JwtService,
  ) {}

  async register(registerDto: RegisterDto): Promise<{
    user: Omit<User, 'password' | 'refreshToken'>;
    tokens: Tokens;
  }> {
    // Проверяем, существует ли пользователь с таким email
    const existingUser = await this.em.findOne(User, {
      email: registerDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // Хешируем пароль
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    // Создаем пользователя
    const user = this.em.create(User, {
      ...registerDto,
      password: hashedPassword,
      role: UserRole.ADMIN,
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date(),
      projects: [],
      lastLoginAt: new Date(),
    });

    await this.em.persistAndFlush(user);

    // Генерируем токены
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Сохраняем refresh token в базе
    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 12);
    await this.em.persistAndFlush(user);

    // Возвращаем пользователя без пароля и refresh token
    const { ...userWithoutSensitiveData } = user;
    return { user: userWithoutSensitiveData, tokens };
  }

  async login(loginDto: LoginDto): Promise<{
    user: Omit<User, 'password' | 'refreshToken'>;
    tokens: Tokens;
  }> {
    // Находим пользователя
    const user = await this.em.findOne(User, { email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Проверяем активность пользователя
    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.password,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    // Генерируем новые токены
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Обновляем refresh token в базе и время последнего входа
    user.refreshToken = await bcrypt.hash(tokens.refreshToken, 12);
    user.lastLoginAt = new Date();
    await this.em.persistAndFlush(user);

    // Возвращаем пользователя без пароля и refresh token
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, refreshToken, ...userWithoutSensitiveData } = user;
    return { user: userWithoutSensitiveData, tokens };
  }

  async refreshToken(refreshTokenDto: RefreshTokenDto): Promise<Tokens> {
    try {
      // Верифицируем refresh token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshTokenDto.refreshToken,
        {
          secret: refreshTokenConfig.secret,
        },
      );

      // Находим пользователя
      const user = await this.em.findOne(User, { id: payload.sub });
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Проверяем, что refresh token в базе совпадает с переданным
      const isRefreshTokenValid = await bcrypt.compare(
        refreshTokenDto.refreshToken,
        user.refreshToken || '',
      );
      if (!isRefreshTokenValid) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      // Генерируем новые токены
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // Обновляем refresh token в базе
      user.refreshToken = await bcrypt.hash(tokens.refreshToken, 12);
      user.updatedAt = new Date();
      await this.em.persistAndFlush(user);

      return tokens;
    } catch {
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(logoutDto: LogoutDto): Promise<void> {
    try {
      // Верифицируем refresh token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        logoutDto.refreshToken,
        {
          secret: refreshTokenConfig.secret,
        },
      );

      // Находим пользователя
      const user = await this.em.findOne(User, { id: payload.sub });
      if (user) {
        // Очищаем refresh token
        user.refreshToken = undefined;
        user.updatedAt = new Date();
        await this.em.persistAndFlush(user);
      }
    } catch {
      // Игнорируем ошибки при logout
    }
  }

  async validateUser(id: string): Promise<User | null> {
    const user = await this.em.findOne(User, { id, isActive: true });
    return user;
  }

  private async generateTokens(
    userId: string,
    email: string,
    role: string,
  ): Promise<Tokens> {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: jwtConfig.secret,
          expiresIn: jwtConfig.signOptions?.expiresIn,
          issuer: jwtConfig.signOptions?.issuer,
          audience: jwtConfig.signOptions?.audience,
        },
      ),
      this.jwtService.signAsync(
        {
          sub: userId,
          email,
          role,
        },
        {
          secret: refreshTokenConfig.secret,
          expiresIn: refreshTokenConfig.expiresIn,
          issuer: jwtConfig.signOptions?.issuer,
          audience: jwtConfig.signOptions?.audience,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
    };
  }
}
