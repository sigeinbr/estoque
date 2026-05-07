import { IsEmail, IsNotEmpty } from 'class-validator';

export class CreateUsuarioDto {
  @IsNotEmpty({ message: 'O campo login é obrigatório' })
  login: string;

  @IsNotEmpty({ message: 'O campo nome é obrigatório' })
  nome: string;

  @IsNotEmpty({ message: 'O campo email é obrigatório' })
  @IsEmail()
  email: string;

  cpf: string;
}
