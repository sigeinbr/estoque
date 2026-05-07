import { IsNotEmpty } from 'class-validator';

export class UpdateUsuarioSenhaDto {
  @IsNotEmpty({ message: 'O campo email é obrigatório' })
  senhaAtual: string;

  @IsNotEmpty({ message: 'O campo email é obrigatório' })
  senhaNova: string;

  @IsNotEmpty({ message: 'O campo email é obrigatório' })
  confirmarSenhaNova: string;
}
