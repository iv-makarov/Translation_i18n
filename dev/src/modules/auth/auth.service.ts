import { EntityManager } from '@mikro-orm/core';
import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { Organization } from 'db/entitis/Organization';
import { Session } from 'db/entitis/Session';
import { UserRole, Users } from 'db/entitis/Users';
import { jwtConfig, refreshTokenConfig } from 'src/config/jwt.config';
import { LoginDto } from 'src/modules/auth/dto/login.dto';
import { RegisterDto } from 'src/modules/auth/dto/register.dto';

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

  async register(registerDto: RegisterDto): Promise<void> {
    // check if user already exists
    const existingUser = await this.em.findOne(Users, {
      email: registerDto.email,
    });
    if (existingUser) {
      throw new ConflictException('User with this email already exists');
    }

    // hash password
    const hashedPassword = await bcrypt.hash(registerDto.password, 12);

    const createOrganization: Organization = this.em.create(Organization, {
      name: registerDto.organizationName,
      createdAt: new Date(),
      updatedAt: new Date(),
      userIds: [],
    });

    await this.em.persistAndFlush(createOrganization);

    // create user
    const user = this.em.create(Users, {
      ...registerDto,
      passwordHash: hashedPassword,
      role: UserRole.OWNER,
      isActive: true,
      isEmailVerified: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      organizationId: createOrganization.id,
      projectIds: [],
    });

    await this.em.persistAndFlush(user);

    // Добавляем ID пользователя в массив userIds организации
    if (createOrganization.userIds) {
      createOrganization.userIds.push(user.id);
    } else {
      createOrganization.userIds = [user.id];
    }
    await this.em.persistAndFlush(createOrganization);
  }

  async login(loginDto: LoginDto): Promise<{
    user: Omit<Users, 'passwordHash'>;
    tokens: Tokens;
  }> {
    // find user
    const user = await this.em.findOne(Users, { email: loginDto.email });
    if (!user) {
      throw new UnauthorizedException('User not found');
    }

    // Проверяем активность пользователя
    if (!user.isActive) {
      throw new UnauthorizedException('User account is deactivated');
    }

    // Проверяем пароль
    const isPasswordValid = await bcrypt.compare(
      loginDto.password,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Password is incorrect');
    }

    // Генерируем новые токены
    const tokens = await this.generateTokens(user.id, user.email, user.role);

    // Создаем новую сессию
    const session = this.em.create(Session, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
      user: user.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      revoked: false,
      createdAt: new Date(),
    });

    // Обновляем время последнего входа
    user.updatedAt = new Date();

    await this.em.persistAndFlush([user, session]);

    // Возвращаем пользователя без пароля
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { passwordHash, ...userWithoutSensitiveData } = user;
    return { user: userWithoutSensitiveData, tokens };
  }

  async refreshToken(refreshToken: string): Promise<Tokens> {
    try {
      // Верифицируем refresh token
      const payload = await this.jwtService.verifyAsync<JwtPayload>(
        refreshToken,
        {
          secret: refreshTokenConfig.secret,
        },
      );

      // Находим сессию по refresh token
      const session = await this.em.findOne(Session, {
        refreshToken,
        revoked: false,
      });

      if (!session) {
        throw new UnauthorizedException('Session not found or revoked');
      }

      // Проверяем, что сессия не истекла
      if (session.expiresAt < new Date()) {
        // Отзываем истекшую сессию
        session.revoked = true;
        await this.em.persistAndFlush(session);
        throw new UnauthorizedException('Session expired');
      }

      // Находим пользователя
      const user = await this.em.findOne(Users, { id: payload.sub });
      if (!user || !user.isActive) {
        throw new UnauthorizedException('User not found or inactive');
      }

      // Генерируем новые токены
      const tokens = await this.generateTokens(user.id, user.email, user.role);

      // Delete old session (since accessToken is Primary Key, we can't update it)
      await this.em.removeAndFlush(session);

      // Create new session with new tokens
      const newSession = this.em.create(Session, {
        accessToken: tokens.accessToken,
        refreshToken: tokens.refreshToken,
        user: user.id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
        revoked: false,
        createdAt: new Date(),
      });

      await this.em.persistAndFlush(newSession);

      return tokens;
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Invalid refresh token');
    }
  }

  async logout(
    accessToken: string | undefined,
    refreshToken: string | undefined,
  ): Promise<void> {
    try {
      // Find session by accessToken or refreshToken
      const session = await this.em.findOne(Session, {
        $or: [
          accessToken ? { accessToken } : {},
          refreshToken ? { refreshToken } : {},
        ],
      });

      if (session) {
        // Delete session from database
        await this.em.removeAndFlush(session);
      }
    } catch (error) {
      console.error(error);
    }
  }

  async validateUser(id: string): Promise<Users | null> {
    const user = await this.em.findOne(Users, { id, isActive: true });
    return user;
  }

  // private setRefreshCookie(res: Response, token: string) {
  //   res.cookie('rt', token, {
  //     httpOnly: true,
  //     secure: true,
  //     sameSite: 'strict', // или 'lax'
  //     path: '/auth/refresh',
  //     maxAge: 30 * 24 * 60 * 60 * 1000,
  //   });
  // }

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
