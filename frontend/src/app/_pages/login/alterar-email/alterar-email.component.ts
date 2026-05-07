import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import { Token, TokensService } from '../../../_shared/services/api/tokens.service';
import { UsuariosService } from '../../../_shared/services/api/usuarios.service';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'login-alterar-email',
  templateUrl: './alterar-email.component.html',
  host: { class: 'login' },
})
export class AlterarEmailComponent {
  // internal variables
  loading: boolean = true;
  valido: boolean = false;
  saving: boolean = false;
  token!: Token;

  constructor(
    private toastService: ToastService,
    private tokenService: TokensService,
    private usuariosService: UsuariosService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  // angular events
  ngOnInit() {
    this.loading = true;

    this.tokenService
      .getOne(this.route.snapshot.queryParamMap.get('token'))
      .pipe(
        finalize(() => {
          this.loading = false;
        })
      )
      .subscribe({
        next: (ret: any) => {
          this.valido = true;
          this.token = ret.entity;
        },
        error: () => (this.valido = false),
      });
  }

  // events functions
  onConfirm() {
    this.saving = true;

    this.usuariosService
      .postOrPut({ email: this.token.parametros.email }, this.token.id, '/email')
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], {
            queryParams: { from: 'alterarEmail' },
          });
        },
        error: (e) => this.toastService.simple(e),
      });
  }
}
