import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import { Result, Type } from 'src/_shared/models/result.model';
import { CreatePadraoDto } from './dto/create-padrao.dto';
import { UpdatePadraoDto } from './dto/update-padrao.dto';
import { PadraoService } from './padrao.service';

@Controller('padrao')
export class PadraoController {
  constructor(private readonly padraoService: PadraoService) {}

  @Post()
  async create(
    @Headers() headers: Headers,
    @Req() request: Request,
    @Body() createPadraoDto: CreatePadraoDto,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const padrao = await this.padraoService.create(
        createPadraoDto,
        context.ug.id,
        request['usuario'].login,
      );

      return new Result(Type.Success, 'Padrão salvo com sucesso!', padrao);
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(
    @Headers() headers: Headers,
    @Param('id') id: number,
    @Req() request: Request,
    @Body() updatePadraoDto: UpdatePadraoDto,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const padrao = await this.padraoService.update(
        id,
        context.ug.id,
        updatePadraoDto,
        request['usuario'].login,
      );

      return new Result(Type.Success, 'Padrão salvo com sucesso!', padrao);
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async delete(
    @Headers() headers: Headers,
    @Param('id') id: number,
    @Req() request: Request,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      if (
        await this.padraoService.delete(
          id,
          context.ug.id,
          request['usuario'].login,
        )
      ) {
        return new Result(Type.Success, 'Padrão excluído com sucesso!');
      } else {
        throw new HttpException(
          new Result(Type.Error, 'Registro não encontrado'),
          HttpStatus.BAD_REQUEST,
        );
      }
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get()
  async findAll(@Headers() headers: Headers) {
    try {
      const context = JSON.parse(headers['context']);

      return await this.padraoService.findAll(context.ug.id);
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
