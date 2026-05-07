import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from 'src/_shared/models/record.model';
import { Result, Type } from 'src/_shared/models/result.model';
import { Repository } from 'typeorm';
import { CreateLogAcessoDto } from './dto/create-log-acesso.dto';
import { LogAcessoDetalhada } from './entities/log-acesso-detalhada.entity';
import { LogAcesso } from './entities/log-acesso.entity';

@Injectable()
export class LogAcessosService {
  constructor(
    @InjectRepository(LogAcesso)
    private logAcessosRepository: Repository<LogAcesso>,
    @InjectRepository(LogAcessoDetalhada)
    private logAcessosDetalhadaRepository: Repository<LogAcessoDetalhada>,
  ) {}

  async create(createLogAcessoDto: CreateLogAcessoDto): Promise<LogAcesso> {
    try {
      const logAcesso = new LogAcesso();
      logAcesso.usuario_login = createLogAcessoDto.usuario_login;
      logAcesso.modulo_id = createLogAcessoDto.modulo_id;
      logAcesso.rota = createLogAcessoDto.rota;
      logAcesso.ip = createLogAcessoDto.ip;
      logAcesso.context = createLogAcessoDto.context;
      logAcesso.user_agent = createLogAcessoDto.user_agent;

      await this.logAcessosRepository.save(logAcesso);

      return logAcesso;
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findAll(fieldsWhere: any): Promise<Record<LogAcesso>> {
    const [data, total] = await this.logAcessosDetalhadaRepository.findAndCount(
      {
        relations: ['modulo'],
        where: fieldsWhere,
        order: { dh_acesso: 'DESC' },
        take: 10,
      },
    );

    return new Record<LogAcesso>({
      data,
      total,
    });
  }
}
