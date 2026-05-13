import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RelatorioParametro } from './entities/relatorio-parametro.entity';
import { Relatorio } from './entities/relatorio.entity';
import { RelatoriosController } from './relatorios.controller';
import { RelatoriosService } from './relatorios.service';

@Module({
  imports: [TypeOrmModule.forFeature([Relatorio, RelatorioParametro])],
  controllers: [RelatoriosController],
  providers: [RelatoriosService],
})
export class RelatoriosModule {}
