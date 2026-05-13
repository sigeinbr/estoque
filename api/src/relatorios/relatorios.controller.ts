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
  Query,
  Req,
} from '@nestjs/common';
import { Result, Type } from 'src/_shared/models/result.model';
import { CreateRelatorioDto } from './dto/create-relatorio.dto';
import { UpdateRelatorioDto } from './dto/update-relatorio.dto';
import { RelatoriosService } from './relatorios.service';
import ModuloConfig from 'src/_shared/modulo-config';

@Controller('relatorios')
export class RelatoriosController {
  constructor(private relatoriosService: RelatoriosService) { }

  @Post()
  async create(
    @Headers() headers: Headers,
    @Req() request: Request,
    @Body() createRelatorioDto: CreateRelatorioDto,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const relatorio = await this.relatoriosService.create(
        request['usuario'].login,
        context.modulo.id,
        createRelatorioDto,
      );

      return new Result(
        Type.Success,
        'Relatório salvo com sucesso!',
        relatorio,
      );
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':id')
  async update(
    @Param('id') id: number,
    @Req() request: Request,
    @Body() updateRelatorioDto: UpdateRelatorioDto,
  ) {
    try {
      const relatorio = await this.relatoriosService.update(
        id,
        request['usuario'].login,
        updateRelatorioDto,
      );

      return new Result(
        Type.Success,
        'Relatorio salva com sucesso!',
        relatorio,
      );
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':id')
  async delete(@Param('id') id: number, @Req() request: Request) {
    try {
      if (await this.relatoriosService.delete(id, request['usuario'].login)) {
        return new Result(Type.Success, 'Relatorio excluído com sucesso!');
      } else {
        throw new HttpException(
          new Result(Type.Error, 'Registro não encontrado!'),
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
  async findAll(
    @Headers() headers: Headers,
    @Req() request: Request,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const moduloId = context.modulo
        ? context.modulo.id
        : parseInt(ModuloConfig.id);

      return await this.relatoriosService.findAll(
        request['usuario'].login,
        moduloId,
        context.ug.id,
      );
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('executar-parametro/:id')
  async executarParametro(
    @Headers() headers: Headers,
    @Param('id') id: number,
    @Query('search') search: string,
    @Body() parametros: any[],
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const query = await this.relatoriosService.executarParametro(
        id,
        parametros,
        context,
        search,
      );

      return query;
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
