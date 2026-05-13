import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { finalize } from 'rxjs';
import { LoadingDialogModule } from '../../../_shared/components/loading-dialog/loading-dialog.module';
import {
  Consulta,
  ConsultasService,
} from '../../../_shared/services/api/consultas.service';
import { ToastService } from '../../../_shared/services/toast.service';
import { ConsultaExecutarDialogComponent } from '../consulta-executar-dialog/consulta-executar-dialog.component';

@Component({
  selector: 'consulta-buscar-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    ButtonModule,
    LoadingDialogModule,
    TableModule,
    IconFieldModule,
    InputIconModule,
    InputTextModule,
    ConsultaExecutarDialogComponent
  ],
  templateUrl: './consulta-buscar-dialog.component.html',
  providers: [ConsultasService],
})
export class ConsultaBuscarDialogComponent {
  // dependencies
  private toastService = inject(ToastService);
  private consultasService = inject(ConsultasService);

  // props
  header = 'Consultas';
  loading: boolean = false;
  data: Consulta[] = [];
  total: number = 0;
  visible: boolean = false;

  // dialog relatórios executar
  @ViewChild(ConsultaExecutarDialogComponent)
  consultaExecutarDialog!: ConsultaExecutarDialogComponent;

  // angular component events

  // events functions
  onShowExecutar(consulta: Consulta) {
    this.consultaExecutarDialog.show(consulta);
  }

  // internal functions
  show() {
    this.loadConsultas();

    this.visible = true;
  }

  loadConsultas() {
    this.loading = true;

    this.consultasService
      .getAll()
      .pipe(finalize(() => (this.loading = false)))
      .subscribe({
        next: (ret) => {
          this.data = ret.data;
          this.total = ret.total;
        },
        error: (e) => this.toastService.simple(e),
      });
  }
}
