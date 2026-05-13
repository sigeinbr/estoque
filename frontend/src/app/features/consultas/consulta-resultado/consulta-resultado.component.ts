import { CommonModule, DatePipe, DecimalPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ButtonModule } from 'primeng/button';
import { OverlayPanelModule } from 'primeng/overlaypanel';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { TooltipModule } from 'primeng/tooltip';
import { finalize } from 'rxjs';
import { TableSelectedColumnsComponent } from '../../../_shared/components/table-selected-columns/table-selected-columns.component';
import HelperFunctions from '../../../_shared/helper-functions';
import {
  Consulta,
  ConsultasService,
} from '../../../_shared/services/api/consultas.service';
import { StorageService } from '../../../_shared/services/storage.service';
import { ToastService } from '../../../_shared/services/toast.service';

interface Column {
  field: string;
  header: string;
  type?: 'date' | 'datetime' | 'currency' | 'text';
}

@Component({
  selector: 'app-consulta-resultado',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    ToggleButtonModule,
    ToastModule,
    TooltipModule,
    OverlayPanelModule,
    TableSelectedColumnsComponent,
  ],
  templateUrl: './consulta-resultado.component.html',
  styles: [
    `
      :host ::ng-deep .consulta-table .p-datatable-thead > tr > th {
        border-right: 1px solid var(--surface-border, #dee2e6);
      }
      :host ::ng-deep .consulta-table .p-datatable-thead > tr > th:last-child {
        border-right: none;
      }
    `,
  ],
  host: { style: ' display: block; width: 100%; flex: 1; padding: 1rem' },
})
export class ConsultaResultadoComponent {
  // dependencies
  private storageService = inject(StorageService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private consultasService = inject(ConsultasService);
  private datePipe = new DatePipe('pt-BR');
  private decimalPipe = new DecimalPipe('pt-BR');

  // props
  loading: boolean = false;
  cols!: Column[];
  _selectedColumns!: Column[];
  data: any[] = [];
  filteredData: any[] = [];
  total: number = 0;
  showFilters: boolean = false;
  offIcon = 'pi pi-filter-slash';
  onIcon = 'pi pi-filter';

  consulta!: Consulta;

  // angular component events
  ngOnInit() {
    this.loading = true;

    const pContext = this.route.snapshot.queryParamMap.get('context');
    const pConsulta = this.route.snapshot.queryParamMap.get('consulta');

    if (pContext && pConsulta) {
      this.storageService.setContext(JSON.parse(atob(pContext)));
      this.consulta = JSON.parse(atob(pConsulta));

      this.consultasService
        .postOrPut(this.consulta.parametros, this.consulta.id, '/executar')
        .pipe(finalize(() => (this.loading = false)))
        .subscribe({
          next: (ret: any) => {
            const rows = Array.isArray(ret) ? ret : ret?.rows ?? [];
            const metaColumns: any[] = ret?.columns ?? [];

            if (!rows.length) {
              this.resetGrid();
              return;
            }

            if (metaColumns.length) {
              this.cols = metaColumns.map((col) => ({
                field: col.name,
                header: col.name,
                type: this.mapBackendType(
                  col.type,
                  col.dataTypeId ?? col.dataTypeID,
                  col.name
                ),
              }));
            } else {
              const json = rows[0];

              this.cols = Object.keys(json).map((key) => {
                return {
                  field: key,
                  header: key,
                  type: 'text',
                };
              });
            }
            this._selectedColumns = this.cols;

            const formattedRows = this.formatRows(rows, this.cols);
            this.data = formattedRows;
            this.filteredData = formattedRows;
            this.total = formattedRows.length;
          },
          error: (e) => this.toastService.simple(e),
        });
    }
  }

  // events functions
  onExport() {
    const exportRows = this.filteredData.map((row) =>
      this.buildDisplayRow(row, this.selectedColumns)
    );
    const csvData = HelperFunctions.convertToCSV(
      exportRows,
      this.selectedColumns.map((col) => col.field)
    );
    const consultaNome = HelperFunctions.parseFilename(this.consulta?.titulo) || 'resultado_consulta';

    HelperFunctions.downloadCSV(csvData, `${consultaNome}.csv`);
  }

  onPrint() {
    const doc = new jsPDF('l', 'mm', 'a4');

    // const columns = Object.keys(this.filteredData[0]);
    const columns = this.selectedColumns;
    const rows = this.filteredData.map((item) =>
      columns.map((column) =>
        this.formatDisplayValue(item[column.field], column.type)
      )
    );
    const headerRow = columns.map((column) => column.field);

    // autoTable(doc, { html: '#my-table' });

    autoTable(doc, {
      head: [headerRow],
      body: rows,
      styles: {
        fontSize: 8,
        halign: 'center',
        valign: 'middle',
      },
      didDrawPage: function (data: any) {
        // Header
        doc.setFontSize(14);
        doc.setTextColor(40);
        doc.text('Resultado da consulta', data.settings.margin.left, 12);

        // Footer
        var str = 'Page ' + 1;

        doc.setFontSize(10);

        // jsPDF 1.4+ uses getWidth, <1.4 uses .width
        var pageSize = doc.internal.pageSize;
        var pageHeight = pageSize.height
          ? pageSize.height
          : pageSize.getHeight();
        doc.text(str, data.settings.margin.left, pageHeight - 10);
      },
    });

    const pdfBlob = doc.output('blob');
    const consultaNome = HelperFunctions.parseFilename(this.consulta?.titulo) || 'resultado_consulta';

    HelperFunctions.downloadPDF(pdfBlob, consultaNome);
  }

  onFilter(event: any) {
    this.filteredData = event.filteredValue;
  }

  // internal functions
  private mapBackendType(
    type: any,
    dataTypeId?: number,
    fieldName?: string
  ): Column['type'] {
    if (
      type === 'date' ||
      type === 'datetime' ||
      type === 'currency' ||
      type === 'text'
    ) {
      return type;
    }

    const dateTypes = new Set([1082]); // DATE
    const dateTimeTypes = new Set([1114, 1184, 1083, 1266]); // TIMESTAMP, TIMESTAMPTZ, TIME, TIMETZ
    const decimalTypes = new Set([1700, 700, 701, 790]); // NUMERIC, FLOAT4, FLOAT8, MONEY
    const integerTypes = new Set([21, 23, 20]); // INT2, INT4, INT8

    if (dataTypeId) {
      if (dateTypes.has(dataTypeId)) return 'date';
      if (dateTimeTypes.has(dataTypeId)) return 'datetime';

      if (decimalTypes.has(dataTypeId)) return 'currency';

      if (integerTypes.has(dataTypeId)) {
        return this.looksLikeCurrencyField(fieldName) ? 'currency' : 'text';
      }
    }

    return 'text';
  }

  private resetGrid() {
    this.cols = [];
    this._selectedColumns = [];
    this.data = [];
    this.filteredData = [];
    this.total = 0;
  }

  private formatRows(rows: any[], columns: Column[]) {
    return rows.map((row) => {
      const formatted: any = {};

      for (const col of columns) {
        const rawValue = row[col.field];
        const resolvedType = this.resolveColumnType(col, rawValue);

        if (col.type === 'text' || !col.type) {
          col.type = resolvedType ?? col.type ?? 'text';
        }

        formatted[col.field] = this.formatValue(rawValue, resolvedType ?? col.type);
      }

      return formatted;
    });
  }

  private resolveColumnType(
    column: Column,
    value: any
  ): Column['type'] | undefined {
    if (column.type && column.type !== 'text') {
      return column.type;
    }

    if (value === null || value === undefined || value === '') {
      return column.type;
    }

    const inferredDateType = this.inferDateType(value);
    if (inferredDateType) {
      return inferredDateType;
    }

    if (this.looksLikeCurrencyField(column.field) && this.isNumericValue(value)) {
      return 'currency';
    }

    return column.type;
  }

  private inferDateType(value: any): Column['type'] | undefined {
    if (value instanceof Date) {
      const hasTime =
        value.getHours() !== 0 ||
        value.getMinutes() !== 0 ||
        value.getSeconds() !== 0 ||
        value.getMilliseconds() !== 0;
      return hasTime ? 'datetime' : 'date';
    }

    const stringValue = String(value ?? '').trim();
    if (!stringValue) {
      return undefined;
    }

    const dateTimePattern =
      /^\d{4}-\d{2}-\d{2}[ T]\d{2}:\d{2}(:\d{2})?/.test(stringValue) ||
      /^\d{2}\/\d{2}\/\d{4}\s+\d{2}:\d{2}(:\d{2})?/.test(stringValue) ||
      /T\d{2}:\d{2}/.test(stringValue);
    if (dateTimePattern) {
      return 'datetime';
    }

    const datePattern =
      /^\d{4}-\d{2}-\d{2}$/.test(stringValue) ||
      /^\d{2}\/\d{2}\/\d{4}$/.test(stringValue);
    if (datePattern) {
      return 'date';
    }

    return undefined;
  }

  private isNumericValue(value: any): boolean {
    if (typeof value === 'number') {
      return Number.isFinite(value);
    }

    const stringValue = String(value ?? '').trim();
    if (!stringValue) {
      return false;
    }

    const normalized = stringValue.replace(/\s+/g, '').replace(/\./g, '').replace(',', '.');
    return !Number.isNaN(Number(normalized));
  }

  private looksLikeCurrencyField(fieldName?: string): boolean {
    const name = (fieldName || '').toLowerCase();
    return ['valor', 'preco', 'preço', 'vl', 'total', 'amount'].some((hint) =>
      name.includes(hint)
    );
  }

  private formatValue(value: any, type?: Column['type']) {
    switch (type) {
      case 'date':
        return this.parseDate(value);
      case 'datetime':
        return this.parseDate(value);
      case 'currency':
        return this.parseCurrency(value);
      default:
        return value;
    }
  }

  private buildDisplayRow(row: any, columns: Column[]) {
    const formatted: any = {};

    for (const col of columns) {
      formatted[col.field] = this.formatDisplayValue(row[col.field], col.type);
    }

    return formatted;
  }

  private formatDisplayValue(value: any, type?: Column['type']) {
    switch (type) {
      case 'date': {
        const parsed = this.parseDate(value);
        return parsed instanceof Date
          ? this.datePipe.transform(parsed, 'dd/MM/yyyy') ?? value
          : value;
      }
      case 'datetime': {
        const parsed = this.parseDate(value);
        return parsed instanceof Date
          ? this.datePipe.transform(parsed, 'dd/MM/yyyy HH:mm:ss') ?? value
          : value;
      }
      case 'currency': {
        const parsed = this.parseCurrency(value);
        return this.decimalPipe.transform(parsed, '1.2-2') ?? parsed;
      }
      default:
        return value;
    }
  }

  private parseDate(value: any) {
    return HelperFunctions.tryParseDate(value) ?? value;
  }

  private parseCurrency(value: any) {
    if (typeof value === 'number') return value;

    const stringValue = String(value ?? '').replace(/\s+/g, '');

    const directParse = Number(stringValue);
    if (!Number.isNaN(directParse)) {
      return directParse;
    }

    const normalized = stringValue.replace(/\./g, '').replace(',', '.');
    const normalizedParse = Number(normalized);

    return Number.isNaN(normalizedParse) ? value ?? 0 : normalizedParse;
  }

  // Getters and setters
  get selectedColumns(): Column[] {
    return this._selectedColumns;
  }

  set selectedColumns(val: Column[]) {
    this._selectedColumns = this.cols.filter((col) => val.includes(col));
  }
}
