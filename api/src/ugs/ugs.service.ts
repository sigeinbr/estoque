import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from 'src/_shared/models/record.model';
import { Repository } from 'typeorm';
import { UgModulo } from './entities/ug-modulo.entity';

@Injectable()
export class UgsService {
  constructor(
    @InjectRepository(UgModulo)
    private ugsModulosRepository: Repository<UgModulo>,
  ) {}

  async findAllModulos(fieldsBy: any): Promise<Record<UgModulo>> {
    const [data, total] = await this.ugsModulosRepository.findAndCount({
      where: fieldsBy,
    });

    return new Record<UgModulo>({
      data,
      total,
    });
  }
}
