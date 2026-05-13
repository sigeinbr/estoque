import { CommonModule } from '@angular/common';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  AutoCompleteCompleteEvent,
  AutoCompleteModule,
} from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { finalize } from 'rxjs';
import { LabelModule } from '../../../_shared/components/label/label.module';
import { TipoCampoEnum } from '../../../_shared/enums/tipo-campo.enum';
import HelperFunctions from '../../../_shared/helper-functions';
import { AppConfigService } from '../../../_shared/services/app-config.service';
import {
  Parametro,
  Relatorio,
  RelatoriosService,
} from '../../../_shared/services/api/relatorios.service';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'relatorio-executar-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    DialogModule,
    ButtonModule,
    LabelModule,
    InputTextModule,
    BadgeModule,
    InputNumberModule,
    InputGroupModule,
    InputGroupAddonModule,
    CalendarModule,
    DropdownModule,
    AutoCompleteModule,
  ],
  templateUrl: './relatorio-executar-dialog.component.html',
  providers: [RelatoriosService],
})
export class RelatorioExecutarDialogComponent {
  // dependencies
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  private http = inject(HttpClient);
  private relatoriosService = inject(RelatoriosService);
  private appConfigService = inject(AppConfigService);

  // props
  visible: boolean = false;
  executing: boolean = false;
  selected!: Relatorio;
  form!: FormGroup;

  sqlListData: any[] = [];

  // angular component events

  // events functions
  onExecute() {
    this.executing = true;

    const apiUrl = this.appConfigService.apiReportsUrl + '/executar';

    let headers: any = {
      Authorization: `Bearer ${localStorage['jwtToken']}`,
      'Content-Type': 'application/json',
    };

    const context = sessionStorage['context'];

    headers = { ...headers, context };

    const relatorio = {
      id: this.selected.id,
      parametros: this.parseParametros(this.form).map((p) => {
        return {
          variavel: p.variavel,
          value: p.value,
          tipo: this.selected.parametros.find(
            (param) => param.variavel == p.variavel
          )?.tipo_campo,
        };
      }),
    };

    this.http
      .post(apiUrl, relatorio, {
        headers: new HttpHeaders(headers),
        responseType: 'blob',
      })
      .pipe(finalize(() => (this.executing = false)))
      .subscribe({
        next: (ret: Blob) => {
          HelperFunctions.downloadPDF(ret, this.selected.titulo);
        },

        error: (e: unknown) => {
          const httpError = e as HttpErrorResponse | null;
          const showMessage = (message?: string) => {
            this.toastService.simple({
              type: 'error',
              message: message ?? httpError?.message ?? e,
            });
          };
          if (httpError?.error instanceof Blob) {
            httpError.error
              .text()
              .then((text) => {
                const parsed = this.extractErrorMessageFromText(text);
                showMessage(parsed ?? text);
              })
              .catch(() => showMessage());
            return;
          }

          const parsed = this.extractErrorMessageFromValue(httpError?.error);
          showMessage(parsed);
        },
      });
  }

  // internal functions
  show(relatorio: Relatorio) {
    this.selected = relatorio;

    this.createForm();

    this.visible = true;
  }

  createForm() {
    this.form = this.formBuilder.group({});

    for (const parametro of this.selected.parametros || []) {
      let valorPadrao;
      switch (parametro.tipo_campo) {
        case TipoCampoEnum.Date:
          valorPadrao = this.parseDateValorPadrao(parametro.valor_padrao);
          break;
        case TipoCampoEnum.DynamicList:
        case TipoCampoEnum.StaticList:
          valorPadrao = parametro.valor_padrao
            ? JSON.parse(parametro.valor_padrao)
            : '';
          break;
        default:
          valorPadrao = parametro.valor_padrao;
      }

      if (parametro.obrigatorio)
        this.form.addControl(
          parametro.variavel,
          new FormControl(valorPadrao, [Validators.required])
        );
      else
        this.form.addControl(parametro.variavel, new FormControl(valorPadrao));
    }
  }

  executarParametro(event: AutoCompleteCompleteEvent, parametro: Parametro) {
    let query = event.query;

    this.relatoriosService
      .postOrPut(
        this.parseParametros(this.form),
        parametro.id,
        '/executar-parametro',
        '?search=' + query
      )
      .subscribe({
        next: (ret: any) => {
          this.sqlListData = ret;
        },
        error: (e) => {
          this.sqlListData = [];
          this.toastService.simple(e);
        },
      });
  }

  parseParametros(formGroup: FormGroup): Parametro[] {
    const parsedParametros: any[] = [];

    Object.keys(formGroup.controls).forEach((key) => {
      const control = formGroup.controls[key];
      const parametro = this.selected.parametros.find(
        (p) => p.variavel == key
      )!;

      if (control instanceof FormGroup) {
        parsedParametros.push({
          variavel: parametro.variavel,
          value: control.value,
        });
      } else if (control.value && parametro?.tipo_campo == TipoCampoEnum.Date) {
        parsedParametros.push({
          variavel: parametro.variavel,
          value: HelperFunctions.formatDate(control.value),
        });
      } else if (
        control.value &&
        (parametro?.tipo_campo == TipoCampoEnum.DynamicList ||
          parametro?.tipo_campo == TipoCampoEnum.StaticList)
      ) {
        parsedParametros.push({
          variavel: parametro.variavel,
          value: control.value ? control.value.id : null,
        });
      } else
        parsedParametros.push({
          variavel: parametro.variavel,
          value: control.value,
        });
    });

    return parsedParametros;
  }

  private parseDateValorPadrao(valorPadrao: any): Date | null {
    if (!valorPadrao) return null;

    if (valorPadrao instanceof Date) {
      return isNaN(valorPadrao.getTime()) ? null : valorPadrao;
    }

    if (typeof valorPadrao === 'string') {
      const trimmed = valorPadrao.trim();
      if (!trimmed) return null;
      const tokenDate = this.getDateFromToken(trimmed);
      if (tokenDate) return tokenDate;
      if (trimmed.includes('/')) {
        const partes = trimmed.split('/');
        if (partes.length === 3) {
          const dia = Number(partes[0]);
          const mes = Number(partes[1]);
          const ano = Number(partes[2]);
          if (
            Number.isFinite(dia) &&
            Number.isFinite(mes) &&
            Number.isFinite(ano)
          ) {
            const parsed = new Date(ano, mes - 1, dia);
            return isNaN(parsed.getTime()) ? null : parsed;
          }
        }
        return null;
      }

      const parsed = trimmed.includes('T')
        ? new Date(trimmed)
        : new Date(trimmed + ' 00:00:00');
      return isNaN(parsed.getTime()) ? null : parsed;
    }

    const parsed = new Date(valorPadrao);
    return isNaN(parsed.getTime()) ? null : parsed;
  }

  private getDateFromToken(token: string): Date | null {
    const hoje = new Date();
    const ano = hoje.getFullYear();
    const mes = hoje.getMonth();

    switch (token) {
      case 'data_atual':
        return new Date(ano, mes, hoje.getDate());
      case 'primeiro_dia_mes':
        return new Date(ano, mes, 1);
      case 'ultimo_dia_mes':
        return new Date(ano, mes + 1, 0);
      case 'primeiro_dia_ano':
        return new Date(ano, 0, 1);
      case 'ultimo_dia_ano':
        return new Date(ano, 11, 31);
      default:
        return null;
    }
  }

  private extractErrorMessageFromText(text: string): string | undefined {
    try {
      const parsed = JSON.parse(text);
      return this.extractErrorMessageFromValue(parsed) ?? text;
    } catch {
      return this.extractJasperMessage(text);
    }
  }

  private extractErrorMessageFromValue(value: unknown): string | undefined {
    if (value && typeof value === 'object') {
      const message = (value as { message?: unknown }).message;
      if (typeof message === 'string') return this.extractJasperMessage(message);
    }
    if (typeof value === 'string') return this.extractJasperMessage(value);
    return undefined;
  }

  private extractJasperMessage(message: string): string {
    const marker = 'JRException:';
    const idx = message.indexOf(marker);
    return idx >= 0 ? message.slice(idx + marker.length).trim() : message;
  }
}
