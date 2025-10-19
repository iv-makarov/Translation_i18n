import type { Request } from 'express';

export interface RequestWithCookies extends Request {
  cookies: {
    accessToken?: string;
    refreshToken?: string;
  };
}
