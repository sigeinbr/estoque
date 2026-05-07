import { IsNotEmpty } from 'class-validator';

export class ResetarUsuarioEmailDto {
  @IsNotEmpty({ message: 'O campo email é obrigatório' })
  email: string;

  @IsNotEmpty({ message: 'O campo emailConfirmar é obrigatório' })
  confirmarEmail: string;
}
