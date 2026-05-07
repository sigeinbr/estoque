import {
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Param,
} from '@nestjs/common';
import { Result, Type } from 'src/_shared/models/result.model';
import { MenusService } from './menus.service';

@Controller('menus')
export class MenusController {
  constructor(private readonly menusService: MenusService) {}

  @Get('modulo/:id')
  async findAll(@Param('id') moduloId: number) {
    try {
      return await this.menusService.findAll(moduloId);
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
