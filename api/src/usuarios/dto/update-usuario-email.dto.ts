import { IsNotEmpty } from 'class-validator';

export class UpdateUsuarioEmailDto {
  @IsNotEmpty({ message: 'O campo email é obrigatório' })
  email: string;
}
