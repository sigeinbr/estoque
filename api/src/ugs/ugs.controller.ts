import {
  Controller,
  Get,
  Headers,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Result, Type } from 'src/_shared/models/result.model';
import { UgsService } from './ugs.service';

@Controller('ugs')
export class UgsController {
  constructor(private readonly ugsService: UgsService) {}

  @Get('modulos')
  async findAllModulos(@Headers() headers: Headers) {
    try {
      const header = JSON.parse(headers['context']);

      return await this.ugsService.findAllModulos({
        ug_id: header.ug.id,
      });
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
