import { IsNotEmpty } from 'class-validator';

export class CreateGrupoPermissaoDto {
  @IsNotEmpty({ message: 'O campo descricao é obrigatório' })
  descricao: string;

  @IsNotEmpty({ message: 'O campo todos_menus é obrigatório' })
  todos_menus: boolean;

  @IsNotEmpty({ message: 'O campo todos_relatorios é obrigatório' })
  todos_relatorios: boolean;

  @IsNotEmpty({ message: 'O campo todas_consultas é obrigatório' })
  todas_consultas: boolean;

  @IsNotEmpty({ message: 'O campo menus é obrigatório' })
  menus: any[];

  @IsNotEmpty({ message: 'O campo relatorios é obrigatório' })
  relatorios: any[];

  @IsNotEmpty({ message: 'O campo consultas é obrigatório' })
  consultas: any[];

  @IsNotEmpty({ message: 'O campo usuarios é obrigatório' })
  usuarios: any[];
}
