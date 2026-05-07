import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from './_resource.service';

export interface Token {
  id: string,
  parametros: any
}

@Injectable({
  providedIn: 'root',
})
export class TokensService extends ResourceService<Token> {
  constructor(httpClient: HttpClient, locationStrategy: LocationStrategy) {
    super(httpClient, locationStrategy, 'tokens');
  }
}
