import { Body, Controller, Get, Headers, Ip, Post, Req } from '@nestjs/common';
import { LogAcessosService } from 'src/log-acessos/log-acessos.service';
import { Public } from '../_shared/decorators/public.decorator';
import { AuthService } from './auth.service';
import { LoginAuthDto } from './dto/login-auth.dto';
import ModuloConfig from 'src/_shared/modulo-config';

@Controller('auth')
export class AuthController {
  constructor(
    private authService: AuthService,
    private readonly logAcessosService: LogAcessosService,
  ) { }

  @Public()
  @Post('login')
  async login(
    @Body() loginAuthDto: LoginAuthDto,
    @Headers() headers: Headers,
    @Req() request: Request,
    @Ip() ip: string,
  ) {
    const jwtToken = await this.authService.login(loginAuthDto);

    await this.logAcessosService.create({
      rota: 'login',
      usuario_login: loginAuthDto.login,
      modulo_id: parseInt(ModuloConfig.id),
      ip: request.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || ip.split(':').pop(),
      context: null,
      user_agent: headers['user-agent'],
    });

    return jwtToken;
  }

  @Get('refresh-jwttoken')
  async refreshToken(@Req() request: Request) {
    const jwtToken = await this.authService.refreshJwtToken(
      request['usuario'].login,
    );

    return jwtToken;
  }
}
