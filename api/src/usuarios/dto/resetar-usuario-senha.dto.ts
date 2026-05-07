import { IsNotEmpty } from 'class-validator';

export class ResetarUsuarioSenhaDto {
  @IsNotEmpty({ message: 'O campo e-mail é obrigatório' })
  email: string;
}
