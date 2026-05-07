import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from './_resource.service';

export interface LogAcesso {
  rota: string;
}

@Injectable({
  providedIn: 'root',
})
export class LogAcessosService extends ResourceService<LogAcesso> {
  constructor(httpClient: HttpClient, locationStrategy: LocationStrategy) {
    super(httpClient, locationStrategy, 'log-acessos');
  }
}
