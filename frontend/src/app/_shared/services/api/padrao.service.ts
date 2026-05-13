import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from './_resource.service';

export interface Padrao {
  id: number;
  ug_id: number;
  created_by: string;
  created_at: Date;
  updated_by: string;
  updated_at: Date;
  campoInteiro: number;
  campoTextoCurto: string;
  campoTextoLongo: string;
  campoData: Date;
  campoDatahora: Date;
  campoBoolean: boolean;
  campoNumeric: number;
  campoArquivo: string;
  campoJson: any;
}

@Injectable()
export class PadraoService extends ResourceService<Padrao> {
  constructor(httpClient: HttpClient, locationStrategy: LocationStrategy) {
    super(httpClient, locationStrategy, 'padrao');
  }
}
