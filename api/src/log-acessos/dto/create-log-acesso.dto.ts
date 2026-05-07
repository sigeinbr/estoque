import { IsNotEmpty } from 'class-validator';

export class CreateLogAcessoDto {
  usuario_login: string;

  modulo_id: number;

  @IsNotEmpty({ message: 'O campo rota é obrigatório' })
  rota: string;

  ip: string;

  context: any;

  user_agent: string;
}
