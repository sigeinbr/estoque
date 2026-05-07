import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from 'src/_shared/models/record.model';
import { Repository } from 'typeorm';
import { Menu } from './entities/menu.entity';

@Injectable()
export class MenusService {
  constructor(
    @InjectRepository(Menu)
    private menusRepository: Repository<Menu>,
  ) {}

  async findAll(moduloId: number): Promise<Record<Menu>> {
    const [data, total] = await this.menusRepository.findAndCount({
      where: { modulo_id: moduloId },
      order: {
        ordem: 'ASC',
        id: 'ASC',
      },
    });

    return new Record<Menu>({
      data,
      total,
    });
  }
}
