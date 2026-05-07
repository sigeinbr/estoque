import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DividerModule } from 'primeng/divider';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';
import { TableModule } from 'primeng/table';
import { LoadingDialogModule } from '../_shared/components/loading-dialog/loading-dialog.module';
import { CpfCnpjPipe } from '../_shared/pipes/cpf-cnpj.pipe';
import { VisualizarPerfilRoutingModule } from './visualizar-perfil-routing.module';
import { VisualizarPerfilComponent } from './visualizar-perfil.component';

@NgModule({
  declarations: [VisualizarPerfilComponent],
  imports: [
    VisualizarPerfilRoutingModule,
    DividerModule,
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    DialogModule,
    LoadingDialogModule,
    TableModule,
    PasswordModule,
    CpfCnpjPipe
  ],
})
export class VisualizarPerfilModule {}
