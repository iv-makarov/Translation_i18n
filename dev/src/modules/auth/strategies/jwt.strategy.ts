import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-jwt';
import { jwtConfig } from 'src/config/jwt.config';

export interface JwtPayload {
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

// Функция для извлечения JWT из cookies
const extractJwtFromCookie = (req: RequestWithCookies): string | null => {
  const token = req.cookies.accessToken;
  return token || null;
};

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: extractJwtFromCookie,
      ignoreExpiration: false,
      secretOrKey: jwtConfig.secret as string,
      passReqToCallback: false,
    });
  }

  validate(payload: JwtPayload) {
    if (!payload.sub || !payload.email) {
      throw new UnauthorizedException('Invalid token payload');
    }

    return {
      id: payload.sub,
      email: payload.email,
      role: payload.role,
    };
  }
}
