import {
  Component,
  HostListener,
  inject,
  OnInit,
} from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { finalize, interval } from 'rxjs';
import HelperFunctions from './_shared/helper-functions';
import ModuloConfig from './_shared/modulo-config';
import { AuthGuard } from './_shared/services/api/_auth/auth.guard';
import { Menu, MenusService } from './_shared/services/api/menus.service';
import { Ug } from './_shared/services/api/ugs.service';
import { Usuario } from './_shared/services/api/usuarios.service';
import { JwtTokenService } from './_shared/services/jwt-token.service';
import { StorageService } from './_shared/services/storage.service';
import { ToastService } from './_shared/services/toast.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
})
export class AppComponent implements OnInit {
  // dependencies
  private toastService = inject(ToastService);
  private authGuard = inject(AuthGuard);
  private storageService = inject(StorageService);
  private menusService = inject(MenusService);
  private jwtTokenService = inject(JwtTokenService);
  private router = inject(Router);

  // props
  title = 'Almoxarifado';
  loading: boolean = false;
  appMenus!: MenuItem[];
  userMenus!: MenuItem[];
  ug?: Ug;
  ugModal: boolean = false;
  usuario!: Usuario;

  // angular component events
  ngOnInit() {
    this.loading = true;

    this.jwtTokenService.check();

    const context = this.storageService.getContext();

    if (context) {
      this.ug = context.ug;
      this.usuario = this.authGuard.currentUser;

      this.loadAppMenus();
      this.loadUserMenus();
    } else this.router.navigate(['/login/escolher-ug']);
  }

  ngAfterViewInit() {
    interval(120000).subscribe(() => {
      this.jwtTokenService.refreshToken();
    });
  }

  // events functions
  onOpenUgModal() {
    this.ugModal = true;
  }

  onEscolherUg(ug: any) {
    this.router.navigate(['/']);

    this.ug = ug;
    this.ugModal = false;

    this.loadAppMenus();
  }

  // internal functions
  loadAppMenus() {
    this.loading = true;

    this.menusService
      .getAll(null, `/modulo/${ModuloConfig.id}`)
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (ret: any) => {
          const usuarioMenus = this.storageService.getUserData().usuarioMenus;

          this.appMenus = HelperFunctions.buildMenus(
            ret.data.map((item: any) =>
              this.createMenuItem(item, usuarioMenus)
            ),
            null
          );
        },
        error: (e) => this.toastService.simple(e),
      });
  }

  loadUserMenus() {
    this.userMenus = [
      {
        label: this.usuario.nome,
        items: [
          { separator: true },
          {
            label: 'Visualizar perfil',
            command: () => {
              this.router.navigate(['/visualizar-perfil']);
            },
          },
          {
            label: 'Sair',
            command: () => {
              this.loading = true;
              setTimeout(() => {
                this.authGuard.logout();
              }, 500);
            },
          },
        ],
      },
    ];
  }

  createMenuItem(item: any, usuarioMenus: any[]): Menu {
    const isDisabled =
      item.menu_pai_id !== null &&
      !usuarioMenus.some((menu) => menu.id === item.id);

    return {
      id: item.id,
      menuPaiId: item.menu_pai_id,
      label: item.descricao,
      routerLink: item.rota,
      icon: item.icon,
      disabled: isDisabled,
    } as Menu;
  }
}
