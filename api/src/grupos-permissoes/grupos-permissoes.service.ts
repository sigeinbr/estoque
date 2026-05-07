import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from 'src/_shared/models/record.model';
import { DataSource, Repository } from 'typeorm';
import { CreateGrupoPermissaoDto } from './dto/create-grupo-permissao.dto';
import { UpdateGrupoPermissaoDto } from './dto/update-grupo-permissao.dto';
import { GrupoPermissaoConsulta } from './entities/grupos-permissoes-consultas.entity';
import { GrupoPermissaoMenu } from './entities/grupos-permissoes-menus.entity';
import { GrupoPermissaoRelatorio } from './entities/grupos-permissoes-relatorios.entity';
import { GrupoPermissaoUsuario } from './entities/grupos-permissoes-usuarios.entity';
import { GrupoPermissao } from './entities/grupos-permissoes.entity';

@Injectable()
export class GruposPermissoesService {
  constructor(
    private dataSource: DataSource,
    @InjectRepository(GrupoPermissao)
    private gruposPermissoesRepository: Repository<GrupoPermissao>,
  ) {}

  async create(
    createGrupoPermissaoDto: CreateGrupoPermissaoDto,
    createdBy: string,
    ugId: number,
    moduloId: number,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Salvando grupo permissão
      const grupoPermissao = new GrupoPermissao();
      grupoPermissao.created_by = createdBy;
      grupoPermissao.descricao = createGrupoPermissaoDto.descricao;
      grupoPermissao.ug_id = ugId;
      grupoPermissao.modulo_id = moduloId;
      grupoPermissao.todos_menus = createGrupoPermissaoDto.todos_menus;
      grupoPermissao.todos_relatorios =
        createGrupoPermissaoDto.todos_relatorios;
      grupoPermissao.todas_consultas = createGrupoPermissaoDto.todas_consultas;

      const entity = await queryRunner.manager.save(grupoPermissao);

      // Salvando os menus
      let grupoPermissaoMenu: GrupoPermissaoMenu;
      if (!createGrupoPermissaoDto.todos_menus) {
        for (const menu of createGrupoPermissaoDto.menus) {
          grupoPermissaoMenu = new GrupoPermissaoMenu();
          grupoPermissaoMenu.created_by = createdBy;
          grupoPermissaoMenu.grupo_permissao_id = entity.id;
          grupoPermissaoMenu.menu_id = menu.id;

          await queryRunner.manager.save(grupoPermissaoMenu);
        }
      }

      // Salvando os relatórios
      let grupoPermissaoRelatorio: GrupoPermissaoRelatorio;
      if (!createGrupoPermissaoDto.todos_relatorios) {
        for (const relatorio of createGrupoPermissaoDto.relatorios) {
          grupoPermissaoRelatorio = new GrupoPermissaoRelatorio();
          grupoPermissaoRelatorio.created_by = createdBy;
          grupoPermissaoRelatorio.grupo_permissao_id = entity.id;
          grupoPermissaoRelatorio.relatorio_id = relatorio.id;

          await queryRunner.manager.save(grupoPermissaoRelatorio);
        }
      }

      // Salvando as consultas
      let grupoPermissaoConsulta: GrupoPermissaoConsulta;
      if (!createGrupoPermissaoDto.todas_consultas) {
        for (const consulta of createGrupoPermissaoDto.consultas) {
          grupoPermissaoConsulta = new GrupoPermissaoConsulta();
          grupoPermissaoConsulta.created_by = createdBy;
          grupoPermissaoConsulta.grupo_permissao_id = entity.id;
          grupoPermissaoConsulta.consulta_id = consulta.id;

          await queryRunner.manager.save(grupoPermissaoConsulta);
        }
      }

      // Salvando os usuários
      let grupoPermissaoUsuario: GrupoPermissaoUsuario;
      for (const usuario of createGrupoPermissaoDto.usuarios) {
        grupoPermissaoUsuario = new GrupoPermissaoUsuario();
        grupoPermissaoUsuario.created_by = createdBy;
        grupoPermissaoUsuario.grupo_permissao_id = entity.id;
        grupoPermissaoUsuario.usuario_login = usuario.login;

        await queryRunner.manager.save(grupoPermissaoUsuario);
      }

      await queryRunner.commitTransaction();

      return await this.gruposPermissoesRepository.findOne({
        relations: ['menus', 'relatorios', 'consultas', 'usuarios'],
        select: {
          menus: { id: true },
          relatorios: { id: true },
          consultas: { id: true },
          usuarios: { login: true },
        },
        where: { id: entity.id },
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async findAll(ugId: number, moduloId: number, option: string) {
    let [data, total] = [[], 0];

    switch (option) {
      case 'all':
        [data, total] = await this.gruposPermissoesRepository.findAndCount({
          relations: ['menus', 'relatorios', 'consultas', 'usuarios'],
          select: {
            menus: { id: true, descricao: true },
            relatorios: { id: true },
            consultas: { id: true },
            usuarios: { login: true },
          },
          where: { ug_id: ugId, modulo_id: moduloId },
          order: {
            descricao: 'ASC',
          },
        });
        break;

      case 'resumed':
        [data, total] = await this.gruposPermissoesRepository.findAndCount({
          select: { id: true, descricao: true },
          where: { ug_id: ugId, modulo_id: moduloId },
          order: {
            descricao: 'ASC',
          },
        });
        break;
    }

    return new Record<GrupoPermissao>({
      data,
      total,
    });
  }

  async update(
    id: number,
    updateGrupoPermissaoDto: UpdateGrupoPermissaoDto,
    updatedBy: string,
  ) {
    const queryRunner = this.dataSource.createQueryRunner();

    await queryRunner.connect();
    await queryRunner.startTransaction();
    try {
      // Atualizando grupo permissão
      await this.gruposPermissoesRepository.update(id, {
        updated_by: updatedBy,
        descricao: updateGrupoPermissaoDto.descricao,
        todos_menus: updateGrupoPermissaoDto.todos_menus,
        todos_relatorios: updateGrupoPermissaoDto.todos_relatorios,
        todas_consultas: updateGrupoPermissaoDto.todas_consultas,
      });

      // Salvando os menus
      await queryRunner.manager.update(
        GrupoPermissaoMenu,
        { grupo_permissao_id: id },
        { deleted_by: updatedBy },
      );
      let grupoPermissaoMenu: GrupoPermissaoMenu;
      if (!updateGrupoPermissaoDto.todos_menus) {
        for (const menu of updateGrupoPermissaoDto.menus) {
          grupoPermissaoMenu = new GrupoPermissaoMenu();
          grupoPermissaoMenu.created_by = updatedBy;
          grupoPermissaoMenu.grupo_permissao_id = id;
          grupoPermissaoMenu.menu_id = menu.id;

          await queryRunner.manager.save(grupoPermissaoMenu);
        }
      }

      // Salvando os relatórios
      await queryRunner.manager.update(
        GrupoPermissaoRelatorio,
        { grupo_permissao_id: id },
        { deleted_by: updatedBy },
      );
      let grupoPermissaoRelatorio: GrupoPermissaoRelatorio;
      if (!updateGrupoPermissaoDto.todos_relatorios) {
        for (const relatorio of updateGrupoPermissaoDto.relatorios) {
          grupoPermissaoRelatorio = new GrupoPermissaoRelatorio();
          grupoPermissaoRelatorio.created_by = updatedBy;
          grupoPermissaoRelatorio.grupo_permissao_id = id;
          grupoPermissaoRelatorio.relatorio_id = relatorio.id;

          await queryRunner.manager.save(grupoPermissaoRelatorio);
        }
      }

      // Salvando as consultas
      await queryRunner.manager.update(
        GrupoPermissaoConsulta,
        { grupo_permissao_id: id },
        { deleted_by: updatedBy },
      );
      let grupoPermissaoConsulta: GrupoPermissaoConsulta;
      if (!updateGrupoPermissaoDto.todas_consultas) {
        for (const consulta of updateGrupoPermissaoDto.consultas) {
          grupoPermissaoConsulta = new GrupoPermissaoConsulta();
          grupoPermissaoConsulta.created_by = updatedBy;
          grupoPermissaoConsulta.grupo_permissao_id = id;
          grupoPermissaoConsulta.consulta_id = consulta.id;

          await queryRunner.manager.save(grupoPermissaoConsulta);
        }
      }

      // Salvando os usuários
      await queryRunner.manager.update(
        GrupoPermissaoUsuario,
        { grupo_permissao_id: id },
        { deleted_by: updatedBy },
      );
      let grupoPermissaoUsuario: GrupoPermissaoUsuario;
      for (const usuario of updateGrupoPermissaoDto.usuarios) {
        grupoPermissaoUsuario = new GrupoPermissaoUsuario();
        grupoPermissaoUsuario.created_by = updatedBy;
        grupoPermissaoUsuario.grupo_permissao_id = id;
        grupoPermissaoUsuario.usuario_login = usuario.login;

        await queryRunner.manager.save(grupoPermissaoUsuario);
      }

      await queryRunner.commitTransaction();

      return await this.gruposPermissoesRepository.findOne({
        relations: ['menus', 'relatorios', 'consultas', 'usuarios'],
        select: {
          menus: { id: true },
          relatorios: { id: true },
          consultas: { id: true },
          usuarios: { login: true },
        },
        where: { id: id },
      });
    } catch (err) {
      await queryRunner.rollbackTransaction();

      throw new Error(err);
    } finally {
      await queryRunner.release();
    }
  }

  async delete(id: number, deletedBy: string) {
    const deleted = await this.gruposPermissoesRepository.update(id, {
      deleted_by: deletedBy,
    });

    return deleted.affected > 0 ? true : false;
  }
}
