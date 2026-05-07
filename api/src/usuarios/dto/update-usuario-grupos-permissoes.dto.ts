import { IsNotEmpty } from 'class-validator';

export class UpdateUsuarioGruposPermissoesDto {
  @IsNotEmpty({ message: 'O campo grupos_permissoes é obrigatório' })
  grupos_permissoes: any[];
}
