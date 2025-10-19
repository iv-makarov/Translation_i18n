import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { refreshTokenConfig } from 'src/config/jwt.config';

export interface RefreshTokenPayload {
  sub: string;
  email: string;
  role: string;
  iat: number;
  exp: number;
}

interface RequestWithCookies {
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}

// Функция для извлечения refresh token из cookies
const extractRefreshTokenFromCookie = (
  req: RequestWithCookies,
): string | null => {
  const token = req.cookies.refreshToken;
  return token || null;
};

@Injectable()
export class RefreshTokenStrategy extends PassportStrategy(
  Strategy,
  'jwt-refresh',
) {
  constructor() {
    super({
      jwtFromRequest: extractRefreshTokenFromCookie,
      ignoreExpiration: false,
      secretOrKey: refreshTokenConfig.secret,
      passReqToCallback: false,
    });
  }

  validate(payload: RefreshTokenPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid refresh token payload');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
