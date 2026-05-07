import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Consulta } from 'src/consultas/entities/consulta.entity';
import { Relatorio } from 'src/relatorios/entities/relatorio.entity';
import { GrupoPermissaoConsulta } from './entities/grupos-permissoes-consultas.entity';
import { GrupoPermissaoMenu } from './entities/grupos-permissoes-menus.entity';
import { GrupoPermissaoRelatorio } from './entities/grupos-permissoes-relatorios.entity';
import { GrupoPermissaoUsuario } from './entities/grupos-permissoes-usuarios.entity';
import { GrupoPermissao } from './entities/grupos-permissoes.entity';
import { GruposPermissoesController } from './grupos-permissoes.controller';
import { GruposPermissoesService } from './grupos-permissoes.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      GrupoPermissao,
      GrupoPermissaoMenu,
      GrupoPermissaoRelatorio,
      GrupoPermissaoConsulta,
      GrupoPermissaoUsuario,
      Relatorio,
      Consulta,
    ]),
  ],
  controllers: [GruposPermissoesController],
  providers: [GruposPermissoesService],
})
export class GruposPermissoesModule {}
