import { PartialType } from '@nestjs/mapped-types';
import { CreateGrupoPermissaoDto } from './create-grupo-permissao.dto';

export class UpdateGrupoPermissaoDto extends PartialType(
  CreateGrupoPermissaoDto,
) {}
