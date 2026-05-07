import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from '../_resource.service';

export interface Login {
  login: string;
  senha: string;
  jwtToken?: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService extends ResourceService<Login> {
  constructor(httpClient: HttpClient, locationStrategy: LocationStrategy) {
    super(httpClient, locationStrategy, 'auth');
  }

  login(auth: Login) {
    return this.postOrPut(auth, -1, '/login');
  }

  refreshJwtToken() {
    return this.get(null, '/refresh-jwttoken');
  }
}
