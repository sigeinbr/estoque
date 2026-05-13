import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Padrao } from './entities/padrao.entity';
import { PadraoController } from './padrao.controller';
import { PadraoService } from './padrao.service';

@Module({
  imports: [TypeOrmModule.forFeature([Padrao])],
  controllers: [PadraoController],
  providers: [PadraoService],
})
export class PadraoModule {}
