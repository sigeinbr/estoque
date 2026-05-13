import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output, ViewEncapsulation } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'table-selected-columns',
  standalone: true,
  imports: [
    ButtonModule,
    TooltipModule,
    OverlayPanelModule,
    CommonModule,
    TableModule,
    FormsModule,
    InputTextModule,
  ],
  templateUrl: './table-selected-columns.component.html',
  encapsulation: ViewEncapsulation.None,
  styles: [
    `
      .table-selected-columns-table .p-datatable-tbody > tr > td {
        border: 0;
      }
    `,
  ],
})
export class TableSelectedColumnsComponent {
  // External properties
  @Input() columns: any[] = [];
  @Input() selectedColumns: any[] = [];
  searchText = '';

  // Emite a seleção atual para o componente pai mostrar/ocultar colunas na grade.
  @Output() selectedColumnsChange = new EventEmitter<any[]>();

  // encaminhar alterações de seleção para o componente pai
  onSelectionChange(selection: any[]) {
    this.selectedColumnsChange.emit(selection);
  }

  get filteredColumns(): any[] {
    const term = this.searchText.trim().toLowerCase();
    if (!term) {
      return this.columns;
    }
    return this.columns.filter((column) => {
      const header = column.header?.toString().toLowerCase() ?? '';
      const field = column.field?.toString().toLowerCase() ?? '';
      return header.includes(term) || field.includes(term);
    });
  }
}
