import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Result, Type } from 'src/_shared/models/result.model';
import { IS_PUBLIC_KEY } from '../_shared/decorators/public.decorator';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private jwtService: JwtService,
    private reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const request = context.switchToHttp().getRequest();

    const jwtToken = this.extractJwtTokenFromHeader(request);

    if (!jwtToken) {
      throw new UnauthorizedException(
        new Result(Type.Error, 'Token não encontrado!'),
      );
    }

    try {
      const payload = await this.jwtService.verifyAsync(jwtToken, {
        secret: process.env.JWT_SECRET,
      });

      request['usuario'] = payload;
    } catch {
      throw new UnauthorizedException(
        new Result(Type.Error, 'Token inválido!'),
      );
    }

    return true;
  }

  private extractJwtTokenFromHeader(request: Request): string | undefined {
    const [type, jwtToken] = request.headers.authorization?.split(' ') ?? [];
    return type === 'Bearer' ? jwtToken : undefined;
  }
}
