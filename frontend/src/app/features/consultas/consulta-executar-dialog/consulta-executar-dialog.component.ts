import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
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
import { LabelModule } from '../../../_shared/components/label/label.module';
import { TipoCampoEnum } from '../../../_shared/enums/tipo-campo.enum';
import HelperFunctions from '../../../_shared/helper-functions';
import {
  Consulta,
  ConsultasService,
  Parametro,
} from '../../../_shared/services/api/consultas.service';
import { StorageService } from '../../../_shared/services/storage.service';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'consulta-executar-dialog',
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
  templateUrl: './consulta-executar-dialog.component.html',
})
export class ConsultaExecutarDialogComponent {
  // dependencies
  private storageService = inject(StorageService);
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  private router = inject(Router);
  private consultasService = inject(ConsultasService);

  // props
  visible: boolean = false;
  selected!: Consulta;
  form!: FormGroup;

  sqlListData: any[] = [];

  // angular component events

  // events functions
  onExecute() {
    const consulta = {
      id: this.selected.id,
      titulo: this.selected.titulo,
      parametros: this.parseParametros(this.form),
    };

    const url = this.router.serializeUrl(
      this.router.createUrlTree(['/consulta-resultado'], {
        queryParams: {
          context: btoa(JSON.stringify(this.storageService.getContext())),
          consulta: btoa(JSON.stringify(consulta)),
        },
      })
    );
    window.open(url, '_blank');
  }

  // internal functions
  show(consulta: Consulta) {
    this.selected = consulta;

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

    this.consultasService
      .postOrPut(
        this.parseParametros(this.form).map((p) => {
          return {
            variavel: p.variavel,
            value: p.value,
          };
        }),
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
          nome: parametro.nome,
          tipo_campo: parametro.tipo_campo,
          value: HelperFunctions.formatDate(control.value),
        });
      } else if (
        control.value &&
        (parametro?.tipo_campo == TipoCampoEnum.DynamicList ||
          parametro?.tipo_campo == TipoCampoEnum.StaticList)
      ) {
        parsedParametros.push({
          variavel: parametro.variavel,
          nome: parametro.nome,
          tipo_campo: parametro.tipo_campo,
          value: control.value ? control.value.id : null,
        });
      } else
        parsedParametros.push({
          variavel: parametro.variavel,
          nome: parametro.nome,
          tipo_campo: parametro.tipo_campo,
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
}
