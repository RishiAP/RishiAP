import {
  CanActivate,
  ExecutionContext,
  Injectable,
  ForbiddenException,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';

export const ALLOWED_ORIGINS_KEY = 'allowedOrigins';

/**
 * Decorator to restrict an endpoint to specific origins.
 * Values should come from env vars (e.g., process.env.ADMIN_ORIGIN).
 *
 * @example
 * @AllowedOrigins(process.env.ADMIN_ORIGIN!)
 * @Controller('api/admin/projects')
 */
export const AllowedOrigins = (...origins: string[]) =>
  SetMetadata(ALLOWED_ORIGINS_KEY, origins.filter(Boolean));

@Injectable()
export class OriginGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const allowedOrigins = this.reflector.getAllAndOverride<string[]>(
      ALLOWED_ORIGINS_KEY,
      [context.getHandler(), context.getClass()],
    );

    // If no @AllowedOrigins decorator is set, allow all
    if (!allowedOrigins || allowedOrigins.length === 0) return true;

    const request = context.switchToHttp().getRequest();
    const origin = request.headers.origin;

    // Allow server-to-server requests (no origin header)
    if (!origin) return true;

    if (!allowedOrigins.includes(origin)) {
      throw new ForbiddenException(
        `Origin '${origin}' is not allowed for this endpoint`,
      );
    }

    return true;
  }
}
