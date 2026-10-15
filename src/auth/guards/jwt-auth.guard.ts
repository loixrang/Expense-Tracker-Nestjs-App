import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { type Request } from 'express';
import { jwtVerify } from 'jose';
import { ConfigService } from '@nestjs/config';
import { DbService } from '../../db/db.service.js';
import {user as users} from '../../db/schema/user.schema.js';
import { eq } from 'drizzle-orm';
import { AuthUser } from '../../types/express.js';
interface AuthenticatedRequests extends Request {
  user?: AuthUser
}

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private readonly config: ConfigService, private readonly database: DbService) {}
  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authorization = request.headers.authorization;

    if (!authorization?.startsWith('Bearer')) {
      throw new UnauthorizedException('Authentication required');
    }

    const token = authorization.slice(7);
    let userId: number
    //verify the JWT
    try {
      const secret = new TextEncoder().encode(this.config.getOrThrow<string>('JWT_SECRET'));

      const { payload } = await jwtVerify(token, secret, {
        algorithms: ['HS256'],
        requiredClaims: ['sub', 'exp'],
      });

      userId = Number(payload.sub);

      if (!Number.isSafeInteger(userId) || userId <= 0) {
        throw new UnauthorizedException('Invalid user ID');
      }
    } catch {
      throw new UnauthorizedException('Invalid or expired token')
    }
    
    //get current user from Database
    const [user] = await this.database.db.select({id: users.id, role: users.role}).from(users).where(eq(users.id, userId)).limit(1)

    if (!user) {
      throw new UnauthorizedException("User no longer exists")
    }

    //attach the currrent role to the request
      request.user = {id: userId, role: user.role}
      return true
  }
}
