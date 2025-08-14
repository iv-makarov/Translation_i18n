import { Injectable, NestMiddleware } from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';

interface RequestWithCookies extends Request {
  cookies: {
    accessToken?: string;
  };
}

@Injectable()
export class CookieParserMiddleware implements NestMiddleware {
  use(req: RequestWithCookies, _res: Response, next: NextFunction) {
    // Извлекаем access token из куки и добавляем в заголовок Authorization
    if (req.cookies?.accessToken && !req.headers.authorization) {
      req.headers.authorization = `Bearer ${req.cookies.accessToken}`;
    }
    next();
  }
}
