import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { verifyToken } from '@clerk/backend';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  constructor(private configService: ConfigService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest();
    const authHeader = request.headers['authorization'];

    if (!authHeader?.startsWith('Bearer ')) {
      throw new UnauthorizedException('Missing authorization header');
    }

    const token = authHeader.slice(7);

    try {
      const secretKey = this.configService.get<string>('CLERK_SECRET_KEY');
      const adminOrigin = this.configService.get<string>('ADMIN_ORIGIN');

      const payload = await verifyToken(token, {
        secretKey: secretKey!,
        authorizedParties: adminOrigin ? adminOrigin.split(',').map(o => o.trim()) : undefined,
      });

      // Attach user info to request
      request.userId = payload.sub;
      request.sessionClaims = payload;
      return true;
    } catch {
      throw new UnauthorizedException('Invalid or expired session');
    }
  }
}
