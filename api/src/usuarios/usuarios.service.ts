import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from 'src/_shared/models/record.model';
import { Result, Type } from 'src/_shared/models/result.model';
import { SendEmailService } from 'src/_shared/services/sendemail.service';
import { comparePassword, hashPassword } from 'src/_shared/utils/bcrypt';
import { GrupoPermissaoUsuario } from 'src/grupos-permissoes/entities/grupos-permissoes-usuarios.entity';
import { Tipo } from 'src/tokens/entities/token.entity';
import { TokensService } from 'src/tokens/tokens.service';
import { DataSource, Repository } from 'typeorm';
import { CreateUsuarioSenhaDto } from './dto/create-usuario-senha.dto';
import { CreateUsuarioDto } from './dto/create-usuario.dto';
import { ResetarUsuarioEmailDto } from './dto/resetar-usuario-email.dto';
import { ResetarUsuarioSenhaDto } from './dto/resetar-usuario-senha.dto';
import { UpdateUsuarioEmailDto } from './dto/update-usuario-email.dto';
import { UpdateUsuarioGruposPermissoesDto } from './dto/update-usuario-grupos-permissoes.dto';
import { UpdateUsuarioSenhaDto } from './dto/update-usuario-senha.dto';
import { UpdateUsuarioDto } from './dto/update-usuario.dto';
import { UsuarioMenu } from './entities/usuario-menu.entity';
import { UsuarioUg } from './entities/usuario-ug.entity';
import { Usuario } from './entities/usuario.entity';

@Injectable()
export class UsuariosService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(Usuario)
    private usuariosRepository: Repository<Usuario>,
    @InjectRepository(UsuarioUg)
    private usuariosUgsRepository: Repository<UsuarioUg>,
    @InjectRepository(UsuarioMenu)
    private usuariosMenusRepository: Repository<UsuarioMenu>,
    private sendEmailService: SendEmailService,
    private tokensService: TokensService,
  ) {}

  async resetarSenha(resetarUsuarioSenhaDto: ResetarUsuarioSenhaDto) {
    // Busca usuário no banco
    const usuario = await this.findOneBy({
      email: resetarUsuarioSenhaDto.email,
    });

    // Verifica se usuário existe pelo e-mail
    if (usuario) {
      // Gera token de Validação
      const token = await this.tokensService.create(Tipo.recuperacao_senha, {
        email: usuario.email,
      });

      // Envia e-mail de recuperação de senha
      const mail = {
        to: resetarUsuarioSenhaDto.email,
        subject: 'Recuperação de senha',
        text: 'Validação de e-mail',
        html: `<h1>Olá ${usuario.nome}</h1><p>Foi recebida uma solicitação para alterar a senha da sua conta do sistema.</p><a href="${process.env.URL_FRONT_ADM}/login/nova-senha?token=${token.id}">Redefinir senha</a>`,
      };

      await this.sendEmailService.send(mail);
    } else {
      throw new HttpException(
        new Result(Type.Error, 'Email inválido!'),
        HttpStatus.BAD_REQUEST,
      );
    }
  }

  async resetarEmail(
    login: string,
    resetarUsuarioEmailDto: ResetarUsuarioEmailDto,
  ) {
    // Verificando se os e-mails são iguais
    if (resetarUsuarioEmailDto.email != resetarUsuarioEmailDto.confirmarEmail) {
      throw new Error('Os e-mails não conferem!');
    }

    // Verificando se existe algum outro usuário com o e-mail
    let usuario = await this.usuariosRepository.findOneBy({
      email: resetarUsuarioEmailDto.email,
    });

    if (usuario) {
      throw new Error(
        `Este e-mail já está cadastrado para o usuário: ${usuario.nome}!`,
      );
    }

    // Busca usuário no banco
    usuario = await this.findOneBy({
      login: login,
    });

    // Gera token de Validação
    const token = await this.tokensService.create(Tipo.validacao_email, {
      login: login,
      email: resetarUsuarioEmailDto.email,
    });

    // Envia e-mail de recuperação de senha
    const mail = {
      to: resetarUsuarioEmailDto.email,
      subject: 'Alteração de e-mail',
      text: 'Validação de e-mail',
      html: `<h1>Olá ${usuario.nome}</h1><p>Foi recebida uma solicitação de alteração de e-mail da sua conta do sistema.</p><a href="${process.env.URL_FRONT_ADM}/login/alterar-email?token=${token.id}">Confirmar</a>`,
    };

    await this.sendEmailService.send(mail);
  }

  async create(
    createUsuarioDto: CreateUsuarioDto,
    createdBy: string,
    ugId: number,
    moduloId: number,
  ) {
    const usuario = new Usuario();
    usuario.login = createUsuarioDto.login;
    usuario.created_by = createdBy;
    usuario.nome = createUsuarioDto.nome;
    usuario.email = createUsuarioDto.email;
    usuario.cpf = createUsuarioDto.cpf;
    usuario.senha = await hashPassword(
      Math.floor(Math.random() * 6).toString(),
    );

    await this.usuariosRepository.save(usuario);

    return await this.findOneByContext(
      { login: usuario.login },
      ugId,
      moduloId,
    );
  }

  async createSenha(createUsuarioSenhaDto: CreateUsuarioSenhaDto) {
    // Busca token no banco
    const token = await this.tokensService.findOneBy({
      id: createUsuarioSenhaDto.token,
    });

    // Verifica se as senhas conferem
    if (createUsuarioSenhaDto.senha !== createUsuarioSenhaDto.confirmarSenha) {
      throw new HttpException(
        new Result(Type.Error, 'Senhas não conferem!'),
        HttpStatus.BAD_REQUEST,
      );
    }

    // Desativa token
    await this.tokensService.update(false, token.id);

    // Busca usuário no banco pelo email do token
    const usuario = await this.findOneBy({
      email: token.parametros.email,
    });

    // Altera senha do usuário
    await this.usuariosRepository.update(usuario.login, {
      senha: await hashPassword(createUsuarioSenhaDto.senha),
      is_verificado: true,
      updated_by: usuario.login,
    });
  }

  async update(
    login: string,
    updateUsuarioDto: UpdateUsuarioDto,
    updatedBy: string,
    ugId: number,
    moduloId: number,
  ) {
    await this.usuariosRepository.update(login, {
      ...updateUsuarioDto,
      updated_by: updatedBy,
    });

    return await this.findOneByContext({ login: login }, ugId, moduloId);
  }

  async updateEmail(
    tokenId: string,
    updateUsuarioEmailDto: UpdateUsuarioEmailDto,
  ) {
    const token = await this.tokensService.findOneBy({ id: tokenId });

    // Desativa token
    await this.tokensService.update(false, token.id);

    const usuarioLogin = token.parametros.login;

    await this.usuariosRepository.update(usuarioLogin, {
      ...updateUsuarioEmailDto,
      updated_by: usuarioLogin,
    });

    await this.usuariosRepository.update(usuarioLogin, {
      is_verificado: true,
      updated_by: usuarioLogin,
    });
  }

  async updateSenha(
    usuarioLogin: string,
    updateUsuarioSenhaDto: UpdateUsuarioSenhaDto,
  ) {
    const usuario = await this.usuariosRepository.findOneBy({
      login: usuarioLogin,
    });

    const checkPassword = await comparePassword(
      updateUsuarioSenhaDto.senhaAtual,
      usuario.senha,
    );

    if (!checkPassword) {
      throw new Error('Senha inválida!');
    }

    if (
      updateUsuarioSenhaDto.senhaNova !=
      updateUsuarioSenhaDto.confirmarSenhaNova
    ) {
      throw new Error('As senha digitada não confere com a da confirmação!');
    }

    await this.usuariosRepository.update(usuario.login, {
      senha: await hashPassword(updateUsuarioSenhaDto.senhaNova),
      updated_by: usuario.login,
    });
  }

  async updateGruposPermissoes(
    login: string,
    updateUsuarioGruposPermissoesDto: UpdateUsuarioGruposPermissoesDto,
    ugId: number,
    moduloId: number,
    updatedBy: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Excluindo todos os grupos de permissões do usuário
      const query = `
        update adm.grupos_permissoes_usuarios gpu
        set deleted_by = $1
        from (
          select gpu.grupo_permissao_id
          from adm.grupos_permissoes_usuarios gpu
            join adm.grupos_permissoes gp on gp.id = gpu.grupo_permissao_id
          where gpu.usuario_login = $2
            and gp.ug_id = $3
            and gp.modulo_id = $4
          ) as gpus
        where gpu.usuario_login = $2
          and gpu.grupo_permissao_id = gpus.grupo_permissao_id
      `;

      await queryRunner.query(query, [updatedBy, login, ugId, moduloId]);

      // Salvando os grupos de permissões
      let grupoPermissaoUsuario: GrupoPermissaoUsuario;
      for (const grupoPermissao of updateUsuarioGruposPermissoesDto.grupos_permissoes) {
        grupoPermissaoUsuario = new GrupoPermissaoUsuario();
        grupoPermissaoUsuario.created_by = updatedBy;
        grupoPermissaoUsuario.grupo_permissao_id = grupoPermissao.id;
        grupoPermissaoUsuario.usuario_login = login;

        await queryRunner.manager.save(grupoPermissaoUsuario);
      }

      await queryRunner.commitTransaction();

      return await this.findOneByContext({ login: login }, ugId, moduloId);
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(login: string, deletedBy: string) {
    const deleted = await this.usuariosRepository.update(login, {
      deleted_by: deletedBy,
    });

    return deleted.affected > 0 ? true : false;
  }

  async findAll(ugId: number, moduloId: number): Promise<Record<Usuario>> {
    const queryBuilder = this.usuariosRepository
      .createQueryBuilder('usuario')
      .leftJoinAndMapMany(
        'usuario.grupos_permissoes',
        'usuario.grupos_permissoes',
        'grupo_permissao',
        'grupo_permissao.modulo_id = :moduloId and grupo_permissao.ug_id = :ugId',
        { ugId: ugId, moduloId: moduloId },
      )
      .select(['usuario', 'grupo_permissao.id', 'grupo_permissao.descricao'])
      .leftJoinAndMapMany('usuario.ugs', 'usuario.ugs', 'ug')
      .leftJoinAndMapMany(
        'usuario.modulos',
        'usuario.modulos',
        'modulo',
        'modulo.ug_id = :ugId',
        { ugId: ugId },
      )
      .orderBy('usuario.login', 'ASC');

    const [data, total] = await queryBuilder.getManyAndCount();

    return new Record<Usuario>({
      data,
      total,
    });
  }

  async findAllUgs(fieldsBy: any): Promise<Record<UsuarioUg>> {
    const [data, total] = await this.usuariosUgsRepository.findAndCount({
      where: fieldsBy,
    });

    return new Record<UsuarioUg>({
      data,
      total,
    });
  }

  async findAllMenus(fieldsBy: any): Promise<Record<UsuarioMenu>> {
    const [data, total] = await this.usuariosMenusRepository.findAndCount({
      where: fieldsBy,
    });

    return new Record<UsuarioMenu>({
      data,
      total,
    });
  }

  async findOneBy(fields: any): Promise<Usuario> {
    return await this.usuariosRepository.findOneBy(fields);
  }

  async findOneByContext(
    fields: any,
    ugId: number,
    moduloId: number,
  ): Promise<Usuario> {
    try {
      const queryBuilder = this.usuariosRepository
        .createQueryBuilder('usuario')
        .leftJoinAndMapMany(
          'usuario.grupos_permissoes',
          'usuario.grupos_permissoes',
          'grupo_permissao',
          'grupo_permissao.modulo_id = :moduloId and grupo_permissao.ug_id = :ugId',
          { ugId: ugId, moduloId: moduloId },
        )
        .select(['usuario', 'grupo_permissao.id', 'grupo_permissao.descricao'])
        .leftJoinAndMapMany('usuario.ugs', 'usuario.ugs', 'ug')
        .leftJoinAndMapMany(
          'usuario.modulos',
          'usuario.modulos',
          'modulo',
          'modulo.ug_id = :ugId',
          { ugId: ugId },
        )
        .where(fields)
        .orderBy('usuario.login', 'ASC');

      return await queryBuilder.getOne();
    } catch (error) {
      throw new HttpException(
        new Result(Type.Error, error.message),
        HttpStatus.BAD_REQUEST,
      );
    }
  }
}
