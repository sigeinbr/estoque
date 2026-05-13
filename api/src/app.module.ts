import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './_auth/auth.module';
import { SendEmailService } from './_shared/services/sendemail.service';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConsultasModule } from './consultas/consultas.module';
import { GruposPermissoesModule } from './grupos-permissoes/grupos-permissoes.module';
import { LogAcessosModule } from './log-acessos/log-acessos.module';
import { RelatoriosModule } from './relatorios/relatorios.module';
import { MenusModule } from './menus/menus.module';
import { ModulosModule } from './modulos/modulos.module';
import { PadraoModule } from './padrao/padrao.module';
import { UgsModule } from './ugs/ugs.module';
import { UsuariosModule } from './usuarios/usuarios.module';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_SIS_USERNAME,
      password: process.env.DB_SIS_PASSWORD,
      database: process.env.DB_DATABASE,
      entities: [__dirname + '/**/*.entity{.ts}'],
      autoLoadEntities: true,
      synchronize: false,
      logging: ['error'],
    }),
    TypeOrmModule.forRoot({
      name: 'consultaExecutar',
      type: 'postgres',
      host: process.env.DB_HOST,
      port: parseInt(process.env.DB_PORT),
      username: process.env.DB_CONS_USERNAME,
      password: process.env.DB_CONS_PASSWORD,
      database: process.env.DB_DATABASE,
    }),
    UsuariosModule,
    AuthModule,
    LogAcessosModule,
    GruposPermissoesModule,
    ModulosModule,
    UgsModule,
    MenusModule,
    PadraoModule,
    RelatoriosModule,
    ConsultasModule,
  ],
  controllers: [AppController],
  providers: [AppService, SendEmailService],
})
export class AppModule {}
