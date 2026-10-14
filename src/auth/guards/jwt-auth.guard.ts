import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify } from 'jose';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer')) {
      throw new UnauthorizedException('Authentication required');
    }

    const token = authorization.slice(7);

    try {
      const secret = new TextEncoder().encode(this.config.getOrThrow<string>('JWT_SECRET'));

      const { payload } = await jwtVerify(token, secret, {
        algorithms: ['HS256'],
        requiredClaims: ['sub', 'exp'],
      });

      const userId = Number(payload.sub);

      if (!Number.isSafeInteger(userId) || userId <= 0) {
        throw new UnauthorizedException('Invalid user ID');
      }

      request.user = {id: userId}
      return true
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }
  }
}
