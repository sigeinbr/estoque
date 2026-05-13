import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TipoCampoEnum } from '../../enums/tipo-campo.enum';
import { ResourceService } from './_resource.service';

export interface Parametro {
  id?: number;
  ordem?: number;
  variavel: string;
  nome: string;
  tipo_campo: TipoCampoEnum;
  tamanho?: number;
  valor_padrao?: string;
  json_lista?: any;
  obrigatorio?: boolean;
  value?: any;
}

export interface Relatorio {
  created_by: string;
  updated_by: string;
  id: number;
  titulo: string;
  descricao: string;
  parametros: Parametro[];
}

@Injectable()
export class RelatoriosService extends ResourceService<Relatorio> {
  constructor(httpClient: HttpClient, locationStrategy: LocationStrategy) {
    super(httpClient, locationStrategy, 'relatorios');
  }
}
