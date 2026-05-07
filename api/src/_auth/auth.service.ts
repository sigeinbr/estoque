import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Result, Type } from 'src/_shared/models/result.model';
import { comparePassword } from 'src/_shared/utils/bcrypt';
import { UsuariosService } from 'src/usuarios/usuarios.service';
import { LoginAuthDto } from './dto/login-auth.dto';

@Injectable()
export class AuthService {
  constructor(
    private usuariosService: UsuariosService,
    private jwtService: JwtService,
  ) {}

  async login(loginAuthDto: LoginAuthDto): Promise<any> {
    // Busca usuário no banco
    const usuario = await this.usuariosService.findOneBy({
      login: loginAuthDto.login,
    });

    // Verifica se usuário existe
    if (!usuario) {
      throw new BadRequestException(
        new Result(Type.Error, 'Usuário ou senha inválidos!'),
      );
    }

    // Verifica se senha confere
    const checkPassword = await comparePassword(
      loginAuthDto.senha,
      usuario.senha,
    );

    if (!checkPassword) {
      throw new BadRequestException(
        new Result(Type.Error, 'Usuário ou senha inválidos!'),
      );
    }

    // Verifica se usuário está verificado
    if (!usuario.is_verificado) {
      throw new BadRequestException(
        new Result(
          Type.Error,
          'Cadastro ainda não foi verificado! Por favor, cheque sua caixa de e-mails.',
        ),
      );
    }

    // Gera token de autenticação
    const payload = { login: usuario.login, nome: usuario.nome };

    return {
      jwtToken: await this.jwtService.signAsync(payload),
    };
  }

  async refreshJwtToken(login: string): Promise<any> {
    const usuario = await this.usuariosService.findOneBy({
      login: login,
    });

    const payload = { login: usuario.login, nome: usuario.nome };

    return {
      jwtToken: await this.jwtService.signAsync(payload),
    };
  }
}
