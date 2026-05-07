import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from './_resource.service';

export interface Modulo {
  id: string;
  descricao: string;
}

@Injectable({
  providedIn: 'root',
})
export class ModulosService extends ResourceService<Modulo> {
  constructor(httpClient: HttpClient, locationStrategy: LocationStrategy) {
    super(httpClient, locationStrategy, 'modulos');
  }
}
