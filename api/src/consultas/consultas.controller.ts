import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  HttpException,
  HttpStatus,
  Ip,
  Param,
  Post,
  Put,
  Query,
  Req,
} from '@nestjs/common';
import { Result, Type } from 'src/_shared/models/result.model';
import { UpdateConsultaDto } from 'src/consultas/dto/update-consulta.dto';
import { LogAcessosService } from 'src/log-acessos/log-acessos.service';
import { ConsultasService } from './consultas.service';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import ModuloConfig from 'src/_shared/modulo-config';

@Controller('consultas')
export class ConsultasController {
  constructor(
    private consultasService: ConsultasService,
    private logAcessosService: LogAcessosService,
  ) { }

  @Post()
  async create(
    @Headers() headers: Headers,
    @Req() request: Request,
    @Body() createConsultaDto: CreateConsultaDto,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const consulta = await this.consultasService.create(
        request['usuario'].login,
        context.modulo.id,
        createConsultaDto,
      );

      return new Result(Type.Success, 'Consulta salva com sucesso!', consulta);
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
    @Body() updateConsultaDto: UpdateConsultaDto,
  ) {
    try {
      const consulta = await this.consultasService.update(
        id,
        request['usuario'].login,
        updateConsultaDto,
      );

      return new Result(Type.Success, 'Consulta salva com sucesso!', consulta);
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
      if (await this.consultasService.delete(id, request['usuario'].login)) {
        return new Result(Type.Success, 'Consulta excluída com sucesso!');
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

  @Put('executar/:id')
  async executar(
    @Req() request: Request,
    @Ip() ip: string,
    @Headers() headers: Headers,
    @Param('id') id: number,
    @Body() parametros: any[],
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const sql_consulta = await this.consultasService.executar(
        ip.split(':').pop(),
        request['usuario'].login,
        headers['user-agent'],
        id,
        parametros,
        context,
      );

      return sql_consulta;
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

      const query = await this.consultasService.executarParametro(
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

      return await this.consultasService.findAll(
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
}
