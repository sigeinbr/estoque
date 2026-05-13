import { Injectable } from '@nestjs/common';
import { InjectEntityManager, InjectRepository } from '@nestjs/typeorm';
import { Context } from 'src/_shared/interfaces/context.interface';
import { Record } from 'src/_shared/models/record.model';
import HelperFunctions from 'src/_shared/utils/helper-functions';
import { types as pgTypes } from 'pg';
import { LogAcessosService } from 'src/log-acessos/log-acessos.service';
import { EntityManager, In, Repository } from 'typeorm';
import { CreateConsultaDto } from './dto/create-consulta.dto';
import { UpdateConsultaDto } from './dto/update-consulta.dto';
import { ConsultaParametro } from './entities/consulta-parametro.entity';
import { Consulta } from './entities/consulta.entity';
import ModuloConfig from 'src/_shared/modulo-config';
import { GrupoPermissao } from 'src/grupos-permissoes/entities/grupos-permissoes.entity';
import { GrupoPermissaoUsuario } from 'src/grupos-permissoes/entities/grupos-permissoes-usuarios.entity';
import { GrupoPermissaoConsulta } from 'src/grupos-permissoes/entities/grupos-permissoes-consultas.entity';
import { Usuario } from 'src/usuarios/entities/usuario.entity';

@Injectable()
export class ConsultasService {
  constructor(
    private logAcessosService: LogAcessosService,
    @InjectRepository(Consulta)
    private consultasRepository: Repository<Consulta>,
    @InjectRepository(ConsultaParametro)
    private consultasParametrosRepository: Repository<ConsultaParametro>,
    @InjectEntityManager('consultaExecutar')
    private entityManager: EntityManager,
  ) { }

  async create(
    createdBy: string,
    moduloId: number,
    createConsultaDto: CreateConsultaDto,
  ): Promise<Consulta> {
    const consulta = new Consulta();
    consulta.created_by = createdBy;
    consulta.modulo_id = moduloId;
    consulta.titulo = createConsultaDto.titulo;
    consulta.descricao = createConsultaDto.descricao;
    consulta.sql_consulta = createConsultaDto.sql_consulta;

    await this.consultasRepository.save(consulta);

    return await this.consultasRepository.findOne({
      where: { id: consulta.id },
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
    updateConsultaDto: UpdateConsultaDto,
  ): Promise<Consulta> {
    await this.consultasRepository.update(id, {
      ...updateConsultaDto,
      updated_by: updatedBy,
    });

    return await this.consultasRepository.findOne({
      where: { id: id },
      order: {
        parametros: {
          ordem: 'ASC',
        },
      },
    });
  }

  async delete(id: number, deletedBy: string) {
    const deleted = await this.consultasRepository.update(id, {
      deleted_by: deletedBy,
    });

    return deleted.affected > 0 ? true : false;
  }

  async executar(
    ip: string,
    usuarioLogin: string,
    userAgent: string,
    id: number,
    parametros: any[],
    context: Context,
  ): Promise<any> {
    const consulta = await this.consultasRepository.findOneBy({ id: id });

    const query = this.parseQuery(consulta.sql_consulta, parametros, context);

    await this.logAcessosService.create({
      rota: '/consultas/executar',
      usuario_login: usuarioLogin,
      modulo_id: parseInt(ModuloConfig.id),
      ip: ip,
      context: {
        id: id,
        context: context,
        parametros: parametros,
        query: query,
      },
      user_agent: userAgent,
    });

    return this.executeQueryWithMetadata(query);
  }

  async executarParametro(
    id: number,
    parametros: any[],
    context: Context,
    search: string,
  ): Promise<any> {
    const parametro = await this.consultasParametrosRepository.findOneBy({
      id: id,
    });
    // Fazendo o parse dos parâmetros
    let query = this.parseQuery(parametro.sql_lista, parametros, context);

    // Fazendo o replace do search
    query = query.replace(`$search`, search);

    return this.consultasParametrosRepository.query(query);
  }

  async findAll(
    usuarioLogin: string,
    moduloId: number,
    ugId: number,
  ): Promise<Record<Consulta>> {
    const rawIds = await this.consultasRepository
      .createQueryBuilder('cons')
      .select('cons.id', 'id')
      .distinct(true)
      .innerJoin(GrupoPermissao, 'gp', 'gp.modulo_id = cons.modulo_id')
      .innerJoin(
        GrupoPermissaoUsuario,
        'gpu',
        'gpu.grupo_permissao_id = gp.id',
      )
      .innerJoin(Usuario, 'us', 'us.login = gpu.usuario_login')
      .leftJoin(
        GrupoPermissaoConsulta,
        'gps',
        'gps.grupo_permissao_id = gp.id AND gps.consulta_id = cons.id',
      )
      .where('gp.modulo_id = :moduloId', { moduloId })
      .andWhere('gp.ug_id = :ugId', { ugId })
      .andWhere('us.login = :usuarioLogin', { usuarioLogin })
      .andWhere(
        '(gp.todas_consultas = true OR gps.consulta_id IS NOT NULL)',
      )
      .getRawMany();

    const consultaIds = rawIds.map((row) => row.id);

    if (consultaIds.length === 0) {
      return new Record<Consulta>({
        data: [],
        total: 0,
      });
    }

    const [data, total] = await this.consultasRepository.findAndCount({
      where: { id: In(consultaIds) },
      order: {
        titulo: 'ASC',
        parametros: {
          ordem: 'ASC',
        },
      },
    });

    return new Record<Consulta>({
      data,
      total,
    });
  }

  // internal functions
  parseQuery(query: string, parametros: any[], context: Context): string {
    // Fazendo o replace dos parâmetros
    for (const parametro in parametros) {
      const param = parametros[parametro];

      let value = param.value;

      if (HelperFunctions.isObject(param.value)) value = value.id;

      query = query.replace(`$${param.variavel}`, value);
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

  private async executeQueryWithMetadata(query: string) {
    const queryRunner = this.entityManager.connection.createQueryRunner();
    await queryRunner.connect();

    try {
      const rawResult = await (queryRunner as any).databaseConnection.query(
        query,
      );

      const columns =
        rawResult?.fields?.map((field: any) => ({
          name: field.name,
          dataTypeId: field.dataTypeID,
          format: field.format,
          type: this.mapPgTypeToUiType(field.dataTypeID),
        })) ?? [];

      return {
        rows: rawResult?.rows ?? [],
        columns,
      };
    } finally {
      await queryRunner.release();
    }
  }

  private mapPgTypeToUiType(
    dataTypeId: number,
  ): 'date' | 'datetime' | 'currency' | 'text' {
    const t = pgTypes.builtins;

    switch (dataTypeId) {
      case t.DATE:
        return 'date';
      case t.TIMESTAMP:
      case t.TIMESTAMPTZ:
      case t.TIME:
      case t.TIMETZ:
        return 'datetime';
      case t.NUMERIC:
      case t.FLOAT4:
      case t.FLOAT8:
      case t.MONEY:
        return 'currency';
      default:
        return 'text';
    }
  }
}
