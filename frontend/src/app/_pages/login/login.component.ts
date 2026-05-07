import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthGuard } from '../../_shared/services/api/_auth/auth.guard';
import {
  AuthService,
  Login,
} from '../../_shared/services/api/_auth/auth.service';
import { ToastService } from '../../_shared/services/toast.service';

@Component({
  selector: 'login',
  templateUrl: './login.component.html',
  host: { class: 'login' },
})
export class LoginComponent implements OnInit {
  // internal variables
  accessing: boolean = false;
  from: string | null = null;
  formLogin!: FormGroup;

  constructor(
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private route: ActivatedRoute,
    private authGuard: AuthGuard
  ) {}

  // angular events
  ngOnInit() {
    this.createForm();
  }

  ngAfterViewInit() {
    this.from = this.route.snapshot.queryParamMap.get('from');

    if (this.from) {
      let message;

      switch (this.from) {
        case 'resetarSenha':
          message = 'Senha alterada com sucesso!';
          break;

        case 'alterarEmail':
          message = 'E-mail alterado com sucesso!';
          break;
      }

      this.toastService.simple({
        details: { type: 'success', message: message },
      });
    }
  }

  // events functions
  onAccess() {
    this.accessing = true;

    this.authService
      .login(<Login>this.formLogin?.value)
      .pipe(
        finalize(() => {
          this.accessing = false;
        })
      )
      .subscribe({
        next: (ret) => {
          this.authGuard.login(ret.jwtToken);
        },
        error: (e) => this.toastService.simple(e),
      });
  }

  // internal functions
  createForm() {
    this.formLogin = this.formBuilder.group({
      login: ['', Validators.required],
      senha: ['', [Validators.required, Validators.minLength(5)]],
    });
  }
}
