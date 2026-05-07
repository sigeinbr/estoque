import { IsNotEmpty } from 'class-validator';

export class LoginAuthDto {
  @IsNotEmpty({ message: 'O campo login é obrigatório' })
  login: string;

  @IsNotEmpty({ message: 'O campo senha é obrigatório' })
  senha: string;
}
