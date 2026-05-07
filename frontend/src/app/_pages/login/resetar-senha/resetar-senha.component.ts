import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { UsuariosService } from '../../../_shared/services/api/usuarios.service';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'login-resetar-senha',
  templateUrl: './resetar-senha.component.html',
  host: { class: 'login' },
})
export class ResetarSenhaComponent {
  // internal variables
  sending: boolean = false;
  formResetarSenha!: FormGroup;
  enviado: boolean = false;

  constructor(
    private toastService: ToastService,
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService
  ) {}

  // angular events
  ngOnInit() {
    this.createForm();
  }

  // events functions
  onSend() {
    this.sending = true;

    this.usuariosService
      .postOrPut(this.formResetarSenha?.value, -1, '/resetar-senha')
      .pipe(
        finalize(() => {
          this.sending = false;
        })
      )
      .subscribe({
        next: () => {
          this.enviado = true;
        },
        error: (e) => this.toastService.simple(e),
      });
  }

  // internal functions
  createForm() {
    this.formResetarSenha = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }
}
