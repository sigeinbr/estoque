import {
  Body,
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Ip,
  Post,
  Req,
} from '@nestjs/common';
import { Result, Type } from 'src/_shared/models/result.model';
import { CreateLogAcessoDto } from './dto/create-log-acesso.dto';
import { LogAcessosService } from './log-acessos.service';
import ModuloConfig from 'src/_shared/modulo-config';

@Controller('log-acessos')
export class LogAcessosController {
  constructor(private readonly logAcessosService: LogAcessosService) {}

  @Post()
  async create(
    @Headers() headers: Headers,
    @Body() createLogAcessoDto: CreateLogAcessoDto,
    @Req() request: Request,
    @Ip() ip: string,
  ) {
    await this.logAcessosService.create({
      ...createLogAcessoDto,
      usuario_login: request['usuario'].login,
      modulo_id: parseInt(ModuloConfig.id),
      ip: request.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() || ip.split(':').pop(),
      context: JSON.parse(headers['context']),
      user_agent: headers['user-agent'],
    });

    return new Result(Type.Success, 'Log de acessos salvo com sucesso!');
  }

  @Get()
  async findAll(@Req() request: Request) {
    try {
      return await this.logAcessosService.findAll({
        usuario_login: request['usuario'].login,
        rota: 'login',
      });
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
