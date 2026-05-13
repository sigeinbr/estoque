import { PartialType } from '@nestjs/mapped-types';
import { CreatePadraoDto } from './create-padrao.dto';

export class UpdatePadraoDto extends PartialType(CreatePadraoDto) {}
