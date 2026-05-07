import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from 'src/_shared/models/record.model';
import { Repository } from 'typeorm';
import { Modulo } from './entities/modulos.entity';

@Injectable()
export class ModulosService {
  constructor(
    @InjectRepository(Modulo)
    private modulosRepository: Repository<Modulo>,
  ) {}

  async findAll() {
    const [data, total] = await this.modulosRepository.findAndCount({
      order: {
        descricao: 'ASC',
      },
    });

    return new Record<Modulo>({
      data,
      total,
    });
  }
}
