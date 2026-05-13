import { CommonModule } from '@angular/common';
import { Component, inject, ViewChild } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { finalize } from 'rxjs';

import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { Table, TableModule } from 'primeng/table';

import { FeatureActionsComponent } from '../../_shared/components/feature-actions/feature-actions.component';
import { TableSelectedColumnsComponent } from '../../_shared/components/table-selected-columns/table-selected-columns.component';
import { TableColumn } from '../../_shared/interfaces/tableColumn';
import { Padrao, PadraoService } from '../../_shared/services/api/padrao.service';
import { ToastService } from '../../_shared/services/toast.service';
import { PadraoDialogComponent } from './padrao-dialog/padrao-dialog.component';

@Component({
  selector: 'padrao',
  standalone: true,
  imports: [
    CommonModule,
    TableModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    MenuModule,
    DialogModule,
    ConfirmDialogModule,
    TableSelectedColumnsComponent,
    PadraoDialogComponent,
    FeatureActionsComponent,
  ],
  templateUrl: './padrao.component.html',
  styles: [
    `
      :host ::ng-deep .padrao-table .p-datatable-thead > tr > th {
        border-right: 1px solid var(--surface-border, #dee2e6);
      }
      :host ::ng-deep .padrao-table .p-datatable-thead > tr > th:last-child {
        border-right: none;
      }
    `,
  ],
  providers: [PadraoService, ConfirmationService],
  host: { class: 'feature' },
})
export class PadraoComponent {
  private toastService = inject(ToastService);
  private confirmationService = inject(ConfirmationService);
  private padraoService = inject(PadraoService);

  titulo = 'Padrão';
  loading = false;
  data: Padrao[] = [];
  total = 0;

  cols: TableColumn[] = [
    { field: 'campoInteiro', header: 'Campo Inteiro', sortable: true },
    { field: 'campoTextoCurto', header: 'Campo Texto Curto', sortable: true, filter: 'text' },
    { field: 'campoData', header: 'Campo Data', sortable: true },
    { field: 'campoBoolean', header: 'Campo Boolean', sortable: true },
    { field: 'campoNumeric', header: 'Campo Numérico', sortable: true },
  ];
  _selectedColumns: TableColumn[] = [];

  colunasDefault(): TableColumn[] {
    return [...this.cols];
  }

  @ViewChild('dt') table?: Table;

  @ViewChild(PadraoDialogComponent)
  padraoDialog!: PadraoDialogComponent;

  ngOnInit() {
    this._selectedColumns = [...this.cols];
    this.load();
  }

  onRefresh() {
    this.load();
  }

  onSave(_ret: any) {
    this.load();
  }

  onDelete() {
    this.confirmationService.confirm({
      message: `Confirma a exclusão do registro (${this.padraoDialog.selected?.id})?`,
      header: `Excluindo ${this.titulo}`,
      icon: 'pi pi-info-circle',
      acceptButtonStyleClass: 'p-button-danger p-button-text',
      rejectButtonStyleClass: 'p-button-text p-button-text',

      accept: () => {
        this.loading = true;

        this.padraoService
          .delete(this.padraoDialog.selected?.id)
          .pipe(finalize(() => (this.loading = false)))
          .subscribe({
            next: (ret) => {
              this.padraoDialog.selected = undefined;
              this.load();
              this.toastService.simple(ret);
            },
            error: (e) => this.toastService.simple(e),
          });
      },
    });
  }

  load() {
    this.loading = true;

    this.padraoService
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

  get selectedColumns(): TableColumn[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: TableColumn[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
    this.clearResizedWidths();
  }

  private clearResizedWidths() {
    setTimeout(() => {
      const host = this.table?.el?.nativeElement as HTMLElement | undefined;
      if (!host) return;

      const resetSelectors = [
        '.p-datatable-scrollable-header-table',
        '.p-datatable-scrollable-body-table',
        '.p-datatable-scrollable-table',
      ];

      resetSelectors.forEach((selector) => {
        host.querySelectorAll(selector).forEach((el) => {
          (el as HTMLElement).style.width = '';
        });
      });

      host.querySelectorAll('th.p-resizable-column').forEach((el) => {
        const th = el as HTMLElement;
        th.style.width = '';
        th.style.minWidth = '';
        th.style.maxWidth = '';
        th.style.flex = '';
      });

      host.querySelectorAll('colgroup col').forEach((el) => {
        (el as HTMLElement).style.width = '';
      });
    });
  }
}
