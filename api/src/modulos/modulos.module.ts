import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Modulo } from './entities/modulos.entity';
import { ModulosController } from './modulos.controller';
import { ModulosService } from './modulos.service';

@Module({
  imports: [TypeOrmModule.forFeature([Modulo])],
  controllers: [ModulosController],
  providers: [ModulosService],
})
export class ModulosModule {}
