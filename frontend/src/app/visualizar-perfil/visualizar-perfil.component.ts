import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { AuthGuard } from '../_shared/services/api/_auth/auth.guard';
import {
  LogAcesso,
  LogAcessosService,
} from '../_shared/services/api/log-acessos.service';
import { Usuario, UsuariosService } from '../_shared/services/api/usuarios.service';
import { ToastService } from '../_shared/services/toast.service';

@Component({
  selector: 'visualizar-perfil',
  templateUrl: './visualizar-perfil.component.html',
  host: { class: 'feature' },
})
export class VisualizarPerfilComponent {
  // internal variables
  loadings: boolean[] = [false, false];
  usuario?: Usuario;
  usuarioAcessos: LogAcesso[] = [];

  // dialog alterar e-mail
  dialogAlterarEmail: boolean = false;
  dialogAlterarEmailForm!: FormGroup;
  dialogAlterarEmailSaving: boolean = false;

  // dialog alterar e-mail
  dialogAlterarSenha: boolean = false;
  dialogAlterarSenhaForm!: FormGroup;
  dialogAlterarSenhaSaving: boolean = false;

  constructor(
    private toastService: ToastService,
    private authGuard: AuthGuard,
    private formBuilder: FormBuilder,
    private usuariosService: UsuariosService,
    private logAcessoService: LogAcessosService
  ) {}

  // angular component events
  ngOnInit() {
    this.loadUsuarioPerfil();
    this.loadUsuarioAcessos();
  }

  // events functions
  onShowDialogAlterarEmail() {
    this.createDialogAlterarEmailForm();

    this.dialogAlterarEmail = true;
  }

  onShowDialogAlterarSenha() {
    this.createDialogAlterarSenhaForm();

    this.dialogAlterarSenha = true;
  }

  onSaveDialogAlterarEmail() {
    this.dialogAlterarEmailSaving = true;

    this.usuariosService
      .postOrPut(this.dialogAlterarEmailForm.value, -1, '/resetar-email')
      .pipe(finalize(() => (this.dialogAlterarEmailSaving = false)))
      .subscribe({
        next: (ret: any) => {
          this.toastService.simple(ret);
          this.onCloseDialogAlterarEmail();
        },
        error: (e) => this.toastService.simple(e),
      });
  }

  onSaveDialogAlterarSenha() {
    this.dialogAlterarSenhaSaving = true;

    this.usuariosService
      .postOrPut(
        this.dialogAlterarSenhaForm.value,
        this.usuario?.login,
        '/senha'
      )
      .pipe(finalize(() => (this.dialogAlterarSenhaSaving = false)))
      .subscribe({
        next: (ret: any) => {
          this.toastService.simple(ret);
          this.onCloseDialogAlterarSenha();
        },
        error: (e) => this.toastService.simple(e),
      });
  }

  onCloseDialogAlterarEmail() {
    this.dialogAlterarEmail = false;
  }

  onCloseDialogAlterarSenha() {
    this.dialogAlterarSenha = false;
  }

  // internal functions
  loadUsuarioPerfil() {
    const currentUser = this.authGuard.currentUser.login;

    this.loadings[0] = true;

    this.usuariosService
      .getOne(currentUser)
      .pipe(
        finalize(() => {
          this.loadings[0] = false;
        })
      )
      .subscribe({
        next: (ret: any) => {
          this.usuario = ret;
        },
        error: (e) => this.toastService.simple(e),
      });
  }

  loadUsuarioAcessos() {
    const currentUser = this.authGuard.currentUser.login;

    this.loadings[1] = true;

    this.logAcessoService
      .getAll()
      .pipe(
        finalize(() => {
          this.loadings[1] = false;
        })
      )
      .subscribe({
        next: (ret: any) => {
          this.usuarioAcessos = ret.data;
        },
        error: (e) => this.toastService.simple(e),
      });
  }

  createDialogAlterarEmailForm() {
    this.dialogAlterarEmailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      confirmarEmail: ['', [Validators.required, Validators.email]],
    });
  }

  createDialogAlterarSenhaForm() {
    this.dialogAlterarSenhaForm = this.formBuilder.group({
      senhaAtual: ['', [Validators.required, Validators.minLength(5)]],
      senhaNova: ['', [Validators.required, Validators.minLength(5)]],
      confirmarSenhaNova: ['', [Validators.required, Validators.minLength(5)]],
    });
  }

  // getters
  get loading() {
    return !this.loadings.every((flag) => flag === false);
  }
}
