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
import { CreateGrupoPermissaoDto } from './dto/create-grupo-permissao.dto';
import { UpdateGrupoPermissaoDto } from './dto/update-grupo-permissao.dto';
import { GruposPermissoesService } from './grupos-permissoes.service';

@Controller('grupos-permissoes')
export class GruposPermissoesController {
  constructor(
    private readonly gruposPermissoesService: GruposPermissoesService,
  ) {}

  @Post()
  async create(
    @Headers() headers: Headers,
    @Req() request: Request,
    @Body() createGrupoPermissaoDto: CreateGrupoPermissaoDto,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const grupoPermissao = await this.gruposPermissoesService.create(
        createGrupoPermissaoDto,
        request['usuario'].login,
        context.ug.id,
        context.modulo.id,
      );

      return new Result(
        Type.Success,
        'Grupo de permissão salvo com sucesso!',
        grupoPermissao,
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
    @Body() updateGrupoPermissaoDto: UpdateGrupoPermissaoDto,
  ) {
    try {
      const grupoPermissao = await this.gruposPermissoesService.update(
        id,
        updateGrupoPermissaoDto,
        request['usuario'].login,
      );

      return new Result(
        Type.Success,
        'Grupo de permissão salvo com sucesso!',
        grupoPermissao,
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
      if (
        await this.gruposPermissoesService.delete(id, request['usuario'].login)
      ) {
        return new Result(
          Type.Success,
          'Grupo de permissão excluído com sucesso!',
        );
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
  async findAll(@Query('option') option: string, @Headers() headers: Headers) {
    try {
      const context = JSON.parse(headers['context']);

      return await this.gruposPermissoesService.findAll(
        context.ug.id,
        context.modulo.id,
        option,
      );
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
