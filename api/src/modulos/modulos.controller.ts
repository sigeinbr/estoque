import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { Result, Type } from 'src/_shared/models/result.model';
import { ModulosService } from './modulos.service';

@Controller('modulos')
export class ModulosController {
  constructor(private readonly modulosService: ModulosService) {}

  @Get()
  async findAll() {
    try {
      return await this.modulosService.findAll();
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
