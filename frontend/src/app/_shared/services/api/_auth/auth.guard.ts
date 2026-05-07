import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { TipoStorageEnum } from '../../../enums/tipo-storage.enum';
import { StorageService } from '../../storage.service';
import { ToastService } from '../../toast.service';
import { LogAcesso, LogAcessosService } from '../log-acessos.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private storageService: StorageService,
    private router: Router,
    private logAcessosService: LogAcessosService,
    private toastService: ToastService
  ) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    if (!this.isLoggedIn) {
      return this.router.parseUrl('/login');
    } else {
      const rota = state.url;
      const userData = this.storageService.getUserData();
      const excludedRoutes = ['/', '/visualizar-perfil'];

      if (userData) {
        if (!excludedRoutes.includes(rota)) {
          const usuarioMenus = userData.usuarioMenus;
          const path = route.url[0]!.path;

          if (!usuarioMenus.find((menu: any) => menu.rota === path)) {
            this.toastService.simple({
              message: 'Você não possui permissão para acessar este recurso!',
              type: 'warn',
            });

            return this.router.parseUrl('/');
          }
        }

        this.logAcessosService.postOrPut(<LogAcesso>{ rota: rota }).subscribe({
          error: (e) => this.toastService.simple(e),
        });
      }

      return true;
    }
  }

  login(jwtToken?: string) {
    this.storageService.setStorage(TipoStorageEnum.Local, 'jwtToken', jwtToken);

    this.router.navigate(['/login/escolher-ug']);
  }

  logout(log: boolean = true) {
    if (log)
      this.logAcessosService
        .postOrPut(<LogAcesso>{ rota: 'logout' })
        .subscribe({
          error: (e) => this.toastService.simple(e),
        });

    this.storageService.removeAllStorage(TipoStorageEnum.Local);
    this.storageService.removeAllStorage(TipoStorageEnum.Session);

    this.router.navigate(['/login']);
  }

  get isLoggedIn() {
    return !!this.currentUser;
  }

  get currentUser(): any {
    if (!this.storageService.hasStorage(TipoStorageEnum.Local, 'jwtToken'))
      return false;

    return jwtDecode(
      this.storageService.getStorage(TipoStorageEnum.Local, 'jwtToken')
    );
  }
}
