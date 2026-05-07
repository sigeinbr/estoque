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
import moduloConfig from 'src/_shared/modulo-config';
import { Public } from '../_shared/decorators/public.decorator';
import { CreateUsuarioSenhaDto } from './dto/create-usuario-senha.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ResetarUsuarioEmailDto } from './dto/resetar-usuario-email.dto';
import { ResetarUsuarioSenhaDto } from './dto/resetar-usuario-senha.dto';
import { UpdateUsuarioEmailDto } from './dto/update-usuario-email.dto';
import { UpdateUsuarioGruposPermissoesDto } from './dto/update-usuario-grupos-permissoes.dto';
import { UpdateUsuarioSenhaDto } from './dto/update-usuario-senha.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuariosService } from './usuarios.service';

@Controller('usuarios')
export class UsuariosController {
  constructor(private usuariosService: UsuariosService) { }

  @Public()
  @Post('resetar-senha')
  async resetarSenha(@Body() resetarUsuarioSenhaDto: ResetarUsuarioSenhaDto) {
    try {
      await this.usuariosService.resetarSenha(resetarUsuarioSenhaDto);

      return new Result(Type.Success, 'Senha redefinida com sucesso!');
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post('resetar-email')
  async resetarEmail(
    @Req() request: Request,
    @Body() resetarUsuarioEmailDto: ResetarUsuarioEmailDto,
  ) {
    try {
      await this.usuariosService.resetarEmail(
        request['usuario'].login,
        resetarUsuarioEmailDto,
      );

      return new Result(
        Type.Success,
        'Enviado e-mail de confirmação de alteração com sucesso!',
      );
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Post()
  async create(
    @Req() request: Request,
    @Headers() headers: Headers,
    @Body() createUsuarioDto: CreateUsuarioDto,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const usuario = await this.usuariosService.create(
        createUsuarioDto,
        request['usuario'].login,
        context.ug.id,
        context.modulo.id,
      );

      return new Result(Type.Success, 'Usuário salvo com sucesso!', usuario);
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Public()
  @Post('senha')
  async createSenha(@Body() createUsuarioSenhaDto: CreateUsuarioSenhaDto) {
    try {
      await this.usuariosService.createSenha(createUsuarioSenhaDto);

      return new Result(Type.Success, 'Senha criada com sucesso!');
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put(':login')
  async update(
    @Req() request: Request,
    @Headers() headers: Headers,
    @Param('login') login: string,
    @Body() updateUsuarioDto: UpdateUsuarioDto,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const usuario = await this.usuariosService.update(
        login,
        updateUsuarioDto,
        request['usuario'].login,
        context.ug.id,
        context.modulo.id,
      );

      return new Result(Type.Success, 'Usuário alterado com sucesso!', usuario);
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('email/:tokenId')
  async updateEmail(
    @Param('tokenId') tokenId: string,
    @Body() updateUsuarioEmailDto: UpdateUsuarioEmailDto,
  ) {
    try {
      await this.usuariosService.updateEmail(tokenId, updateUsuarioEmailDto);

      return new Result(Type.Success, 'E-mail alterado com sucesso!');
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('senha/:login')
  async updateSenha(
    @Param('login') login: string,
    @Body() updateUsuarioSenhaDto: UpdateUsuarioSenhaDto,
  ) {
    try {
      await this.usuariosService.updateSenha(login, updateUsuarioSenhaDto);

      return new Result(Type.Success, 'Senha alterada com sucesso!');
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Put('grupos-permissoes/:login')
  async updateGruposPermissoes(
    @Req() request: Request,
    @Headers() headers: Headers,
    @Param('login') login: string,
    @Body() updateUsuarioGruposPermissoesDto: UpdateUsuarioGruposPermissoesDto,
  ) {
    try {
      const context = JSON.parse(headers['context']);

      const usuario = await this.usuariosService.updateGruposPermissoes(
        login,
        updateUsuarioGruposPermissoesDto,
        context.ug.id,
        context.modulo.id,
        request['usuario'].login,
      );

      return new Result(
        Type.Success,
        'Grupos de permissoes alterado com sucesso!',
        usuario,
      );
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Delete(':login')
  async delete(@Param('login') login: string, @Req() request: Request) {
    try {
      if (await this.usuariosService.delete(login, request['usuario'].login)) {
        return new Result(Type.Success, 'Usuário excluído com sucesso!');
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
  async findAll(@Headers() headers: Headers) {
    try {
      const context = JSON.parse(headers['context']);

      return await this.usuariosService.findAll(
        context.ug.id,
        context.modulo.id,
      );
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('ugs')
  async findAllUgs(@Req() request: Request) {
    try {
      return await this.usuariosService.findAllUgs({
        usuario_login: request['usuario'].login,
      });
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get('menus')
  async findAllMenus(@Req() request: Request, @Headers() headers: Headers) {
    try {
      const context = JSON.parse(headers['context']);
      const moduloId = parseInt(moduloConfig.id);

      return await this.usuariosService.findAllMenus({
        usuario_login: request['usuario'].login,
        ug_id: context.ug.id,
        modulo_id: moduloId,
      });
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  @Get(':login')
  async findOne(@Param('login') login: string) {
    try {
      return await this.usuariosService.findOneBy({ login: login });
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
