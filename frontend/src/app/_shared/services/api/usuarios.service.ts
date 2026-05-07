import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from './_resource.service';

export interface Usuario {
  created_by: string;
  updated_by: string;
  login: string;
  nome: string;
  email: string;
  cpf: string;
  grupos_permissoes: any[];
}

@Injectable({
  providedIn: 'root',
})
export class UsuariosService extends ResourceService<Usuario> {
  constructor(httpClient: HttpClient, locationStrategy: LocationStrategy) {
    super(httpClient, locationStrategy, 'usuarios');
  }
}
