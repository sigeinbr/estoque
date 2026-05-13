import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Record } from 'src/_shared/models/record.model';
import { Repository, In } from 'typeorm';
import { Context } from 'vm';
import { CreateRelatorioDto } from './dto/create-relatorio.dto';
import { UpdateRelatorioDto } from './dto/update-relatorio.dto';
import { RelatorioParametro } from './entities/relatorio-parametro.entity';
import { Relatorio } from './entities/relatorio.entity';
import { GrupoPermissao } from 'src/grupos-permissoes/entities/grupos-permissoes.entity';
import { GrupoPermissaoUsuario } from 'src/grupos-permissoes/entities/grupos-permissoes-usuarios.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';
import { GrupoPermissaoRelatorio } from 'src/grupos-permissoes/entities/grupos-permissoes-relatorios.entity';

@Injectable()
export class RelatoriosService {
  constructor(
    @InjectRepository(Relatorio)
    private relatoriosRepository: Repository<Relatorio>,
    @InjectRepository(RelatorioParametro)
    private relatoriosParametrosRepository: Repository<RelatorioParametro>,
  ) { }

  async create(
    createdBy: string,
    moduloId: number,
    createRelatorioDto: CreateRelatorioDto,
  ): Promise<Relatorio> {
    const relatorio = new Relatorio();
    relatorio.created_by = createdBy;
    relatorio.modulo_id = moduloId;
    relatorio.titulo = createRelatorioDto.titulo;
    relatorio.descricao = createRelatorioDto.descricao;
    relatorio.arquivo = createRelatorioDto.arquivo;

    await this.relatoriosRepository.save(relatorio);

    return await this.relatoriosRepository.findOne({
      where: { id: relatorio.id },
      order: {
        parametros: {
          ordem: 'ASC',
        },
      },
    });
  }

  async update(
    id: number,
    updatedBy: string,
    updateRelatorioDto: UpdateRelatorioDto,
  ): Promise<Relatorio> {
    await this.relatoriosRepository.update(id, {
      ...updateRelatorioDto,
      updated_by: updatedBy,
    });

    return await this.relatoriosRepository.findOne({
      where: { id: id },
      order: {
        parametros: {
          ordem: 'ASC',
        },
      },
    });
  }

  async delete(id: number, deletedBy: string) {
    const deleted = await this.relatoriosRepository.update(id, {
      deleted_by: deletedBy,
    });

    return deleted.affected > 0 ? true : false;
  }

  async findAll(
    usuarioLogin: string,
    moduloId: number,
    ugId: number,
  ): Promise<Record<Relatorio>> {
    const rawIds = await this.relatoriosRepository
      .createQueryBuilder('rel')
      .select('rel.id', 'id')
      .distinct(true)
      .innerJoin(GrupoPermissao, 'gp', 'gp.modulo_id = rel.modulo_id')
      .innerJoin(
        GrupoPermissaoUsuario,
        'gpu',
        'gpu.grupo_permissao_id = gp.id',
      )
      .innerJoin(Usuario, 'us', 'us.login = gpu.usuario_login')
      .leftJoin(
        GrupoPermissaoRelatorio,
        'gps',
        'gps.grupo_permissao_id = gp.id AND gps.relatorio_id = rel.id',
      )
      .where('gp.modulo_id = :moduloId', { moduloId })
      .andWhere('gp.ug_id = :ugId', { ugId })
      .andWhere('us.login = :usuarioLogin', { usuarioLogin })
      .andWhere(
        '(gp.todos_relatorios = true OR gps.relatorio_id IS NOT NULL)',
      )
      .getRawMany();

    const relatorioIds = rawIds.map((row) => row.id);

    if (relatorioIds.length === 0) {
      return new Record<Relatorio>({
        data: [],
        total: 0,
      });
    }

    const [data, total] = await this.relatoriosRepository.findAndCount({
      where: { id: In(relatorioIds) },
      order: {
        titulo: 'ASC',
        parametros: {
          ordem: 'ASC',
        },
      },
    });

    return new Record<Relatorio>({
      data,
      total,
    });

  }

  async executarParametro(
    id: number,
    parametros: any[],
    context: Context,
    search: string,
  ): Promise<any> {
    const parametro = await this.relatoriosParametrosRepository.findOneBy({
      id: id,
    });
    // Fazendo o parse dos parâmetros
    let query = this.parseQuery(parametro.sql_lista, parametros, context);

    // Fazendo o replace do search
    query = query.replace(`$search`, search);

    return this.relatoriosParametrosRepository.query(query);
  }

  // internal functions
  parseQuery(query: string, parametros: any[], context: Context): string {
    // Fazendo o replace dos parâmetros
    for (const parametro in parametros) {
      const param = parametros[parametro];

      query = query.replaceAll(`$${param.variavel}`, param.value);
    }

    // Fazendo o replace do context
    if (context.ug.id)
      query = query.replace('$context.ug.id', context.ug.id.toString());
    if (context.modulo && context.modulo.id)
      query = query.replace('$context.modulo.id', context.modulo.id.toString());
    if (context.exercicio)
      query = query.replace('$context.exercicio', context.exercicio.toString());

    return query;
  }
}
