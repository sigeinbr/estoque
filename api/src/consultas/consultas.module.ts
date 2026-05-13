import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogAcessosModule } from 'src/log-acessos/log-acessos.module';
import { ConsultasController } from './consultas.controller';
import { ConsultasService } from './consultas.service';
import { ConsultaParametro } from './entities/consulta-parametro.entity';
import { Consulta } from './entities/consulta.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([Consulta, ConsultaParametro]),
    TypeOrmModule.forFeature([], 'consultaExecutar'),
    LogAcessosModule,
  ],
  controllers: [ConsultasController],
  providers: [ConsultasService],
})
export class ConsultasModule {}
