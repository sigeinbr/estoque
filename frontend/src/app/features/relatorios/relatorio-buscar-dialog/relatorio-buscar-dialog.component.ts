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
  Relatorio,
  RelatoriosService,
} from '../../../_shared/services/api/relatorios.service';
import { ToastService } from '../../../_shared/services/toast.service';
import { RelatorioExecutarDialogComponent } from "../relatorio-executar-dialog/relatorio-executar-dialog.component";

@Component({
  selector: 'relatorio-buscar-dialog',
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
    RelatorioExecutarDialogComponent
  ],
  templateUrl: './relatorio-buscar-dialog.component.html',
  providers: [RelatoriosService],
})
export class RelatorioBuscarDialogComponent {
  // dependencies
  private toastService = inject(ToastService);
  private relatoriosService = inject(RelatoriosService);

  // props
  header = 'Relatórios';
  loading: boolean = false;
  data: Relatorio[] = [];
  total: number = 0;
  visible: boolean = false;

  // dialog relatórios executar
  @ViewChild(RelatorioExecutarDialogComponent)
  relatorioExecutarDialog!: RelatorioExecutarDialogComponent;

  // angular component events

  // events functions
  onShowExecutar(relatorio: Relatorio) {
    this.relatorioExecutarDialog.show(relatorio);
  }

  // internal functions
  show() {
    this.loadRelatorios();

    this.visible = true;
  }

  loadRelatorios() {
    this.loading = true;

    this.relatoriosService
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
