import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Observable } from 'rxjs';

interface RequestWithUser extends Request {
  user?: {
    id: string;
    email: string;
    role: string;
  };
  userId?: string;
  userEmail?: string;
  userRole?: string;
}

@Injectable()
export class UserInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest<RequestWithUser>();

    // Добавляем пользователя в запрос для использования в контроллерах
    if (request.user) {
      request.userId = request.user.id;
      request.userEmail = request.user.email;
      request.userRole = request.user.role;
    }

    return next.handle();
  }
}
