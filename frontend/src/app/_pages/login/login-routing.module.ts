import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AlterarEmailComponent } from './alterar-email/alterar-email.component';
import { EscolherUgComponent } from './escolher-ug/escolher-ug.component';
import { LoginComponent } from './login.component';
import { NovaSenhaComponent } from './resetar-senha/nova-senha.component';
import { ResetarSenhaComponent } from './resetar-senha/resetar-senha.component';

@NgModule({
  imports: [
    RouterModule.forChild([
      { path: '', component: LoginComponent },
      { path: 'resetar-senha', component: ResetarSenhaComponent },
      { path: 'nova-senha', component: NovaSenhaComponent },
      { path: 'alterar-email', component: AlterarEmailComponent },
      { path: 'escolher-ug', component: EscolherUgComponent },
    ]),
  ],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
