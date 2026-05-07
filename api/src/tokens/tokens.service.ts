import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Result, Type } from 'src/_shared/models/result.model';
import { Repository } from 'typeorm';
import { Tipo, Token } from './entities/token.entity';

@Injectable()
export class TokensService {
  constructor(
    @InjectRepository(Token)
    private tokensRepository: Repository<Token>,
  ) {}

  async create(tipo: Tipo, parametros: any): Promise<any> {
    try {
      const token = new Token();
      token.tipo = tipo;
      token.parametros = parametros;

      return await this.tokensRepository.save(token);
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async update(ativo: boolean, id: string) {
    try {
      await this.tokensRepository.update(id, {
        ativo: ativo,
      });
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async findOneBy(fields: any) {
    try {
      const token = await this.tokensRepository.findOneBy(fields);

      if (!token) {
        throw new HttpException(
          new Result(Type.Error, 'Token inválido!'),
          HttpStatus.BAD_REQUEST,
        );
      }

      return token;
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
