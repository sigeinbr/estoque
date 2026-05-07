import { Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import { TipoStorageEnum } from '../enums/tipo-storage.enum';
import { AuthGuard } from './api/_auth/auth.guard';
import { AuthService } from './api/_auth/auth.service';
import { StorageService } from './storage.service';

export enum TokenStatus {
  Refresh,
  Invalid,
  OnTime,
}

@Injectable({
  providedIn: 'root',
})
export class JwtTokenService {
  constructor(
    private authGuard: AuthGuard,
    private storageService: StorageService,
    private authService: AuthService
  ) {}

  check(): TokenStatus {
    const bufferTime = 300; // 5 minutes in seconds

    const jwtTokenDecode = jwtDecode(
      this.storageService.getStorage(TipoStorageEnum.Local, 'jwtToken')
    );

    const expirationTime: any = jwtTokenDecode.exp;
    const currentTimeInSeconds = Math.floor(new Date().getTime() / 1000);
    const timeDifference = expirationTime - currentTimeInSeconds;

    if (timeDifference <= bufferTime && timeDifference > 0) {
      return TokenStatus.Refresh;
    } else if (timeDifference <= 0) {
      this.authGuard.logout(false);

      return TokenStatus.Invalid;
    } else return TokenStatus.OnTime;
  }

  refreshToken() {
    if (this.check() == TokenStatus.Refresh)
      this.authService
        .refreshJwtToken()
        .subscribe({
          next: (ret) => {
            this.storageService.setStorage(
              TipoStorageEnum.Local,
              'jwtToken',
              ret.jwtToken
            );
          },
          error: () => this.authGuard.logout(),
        });
  }
}
