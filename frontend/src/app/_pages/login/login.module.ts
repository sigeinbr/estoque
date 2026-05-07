import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { AutoFocusModule } from 'primeng/autofocus';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { InputMaskModule } from 'primeng/inputmask';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { ToastModule } from 'primeng/toast';
import { ModuloListModule } from '../../_shared/components/modulo-list/modulo-list.module';
import { UgListModule } from '../../_shared/components/ug-list/ug-list.module';
import { AlterarEmailComponent } from './alterar-email/alterar-email.component';
import { EscolherUgComponent } from './escolher-ug/escolher-ug.component';
import { LoginRoutingModule } from './login-routing.module';
import { LoginComponent } from './login.component';
import { NovaSenhaComponent } from './resetar-senha/nova-senha.component';
import { ResetarSenhaComponent } from './resetar-senha/resetar-senha.component';

@NgModule({
  imports: [
    CommonModule,
    ReactiveFormsModule,
    LoginRoutingModule,
    ButtonModule,
    CardModule,
    InputTextModule,
    PasswordModule,
    AutoFocusModule,
    ToastModule,
    InputMaskModule,
    UgListModule,
    ModuloListModule,
  ],
  declarations: [
    LoginComponent,
    ResetarSenhaComponent,
    NovaSenhaComponent,
    AlterarEmailComponent,
    EscolherUgComponent,
  ],
  providers: [],
})
export class LoginModule {}
