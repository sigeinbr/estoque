import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SendEmailService } from 'src/_shared/services/sendemail.service';
import { TokensModule } from 'src/tokens/tokens.module';
import { UsuarioMenu } from './entities/usuario-menu.entity';
import { UsuarioModulo } from './entities/usuario-modulo.entity';
import { UsuarioUg } from './entities/usuario-ug.entity';
import { Usuario } from './entities/usuario.entity';
import { UsuariosController } from './usuarios.controller';
import { UsuariosService } from './usuarios.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Usuario, UsuarioUg, UsuarioModulo, UsuarioMenu]),
    TokensModule,
  ],
  controllers: [UsuariosController],
  providers: [UsuariosService, SendEmailService],
  exports: [UsuariosService],
})
export class UsuariosModule { }
