import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from './_resource.service';

export interface Ug {
  id: string;
  nome: string;
}

@Injectable({
  providedIn: 'root',
})
export class UgsService extends ResourceService<Ug> {
  constructor(httpClient: HttpClient, locationStrategy: LocationStrategy) {
    super(httpClient, locationStrategy, 'ugs');
  }
}
