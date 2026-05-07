import { IsNotEmpty } from 'class-validator';

export class CreateUsuarioSenhaDto {
  @IsNotEmpty({ message: 'O campo token é obrigatório' })
  token: string;

  @IsNotEmpty({ message: 'O campo senha é obrigatório' })
  senha: string;

  @IsNotEmpty({ message: 'O campo confirmar senha é obrigatório' })
  confirmarSenha: string;
}
