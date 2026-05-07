import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { finalize } from 'rxjs';
import {
  Token,
  TokensService,
} from '../../../_shared/services/api/tokens.service';
import { UsuariosService } from '../../../_shared/services/api/usuarios.service';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'login-nova-senha',
  templateUrl: './nova-senha.component.html',
  host: { class: 'login' },
})
export class NovaSenhaComponent {
  // internal variables
  loading: boolean = true;
  valido: boolean = false;
  saving: boolean = false;
  token!: Token;
  formNovaSenha!: FormGroup;

  constructor(
    private toastService: ToastService,
    private formBuilder: FormBuilder,
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
          this.createForm();
        },
        error: () => (this.valido = false),
      });
  }

  // events functions
  onSave() {
    this.saving = true;

    this.usuariosService
      .postOrPut(
        { token: this.token.id, ...this.formNovaSenha?.value },
        -1,
        '/senha'
      )
      .pipe(
        finalize(() => {
          this.saving = false;
        })
      )
      .subscribe({
        next: () => {
          this.router.navigate(['/login'], {
            queryParams: { from: 'resetarSenha' },
          });
        },
        error: (e) => this.toastService.simple(e),
      });
  }

  // internal functions
  createForm() {
    this.formNovaSenha = this.formBuilder.group({
      senha: ['', [Validators.required, Validators.minLength(5)]],
      confirmarSenha: ['', [Validators.required, Validators.minLength(5)]],
    });
  }
}
