import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LogAcessoDetalhada } from './entities/log-acesso-detalhada.entity';
import { LogAcesso } from './entities/log-acesso.entity';
import { LogAcessosController } from './log-acessos.controller';
import { LogAcessosService } from './log-acessos.service';

@Module({
  imports: [TypeOrmModule.forFeature([LogAcesso, LogAcessoDetalhada])],
  controllers: [LogAcessosController],
  providers: [LogAcessosService],
  exports: [LogAcessosService],
})
export class LogAcessosModule {}
