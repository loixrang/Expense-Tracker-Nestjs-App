import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { jwtVerify } from 'jose';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer')) {
      throw new UnauthorizedException('Authentication required');
    }

    const token = authorization.slice(7);

    try {
      const secretValue = process.env.JWT_SECRET;

      if (!secretValue || secretValue.length < 32) {
        throw new Error('JWT_SECRET must contain a random secret');
      }
      const secret = new TextEncoder().encode(secretValue);

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
