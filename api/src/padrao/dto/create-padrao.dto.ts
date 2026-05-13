import { IsNotEmpty, IsOptional } from 'class-validator';

export class CreatePadraoDto {
  @IsNotEmpty({ message: 'O campo "campoInteiro" é obrigatório' })
  campoInteiro: number;

  @IsOptional()
  campoTextoCurto?: string;

  @IsOptional()
  campoTextoLongo?: string;

  @IsOptional()
  campoData?: Date;

  @IsOptional()
  campoDatahora?: Date;

  @IsOptional()
  campoBoolean?: boolean;

  @IsOptional()
  campoNumeric?: number;

  @IsOptional()
  campoArquivo?: string;

  @IsOptional()
  campoJson?: any;
}
