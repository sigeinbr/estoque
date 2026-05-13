import { CommonModule } from '@angular/common';
import { Component, EventEmitter, inject, Output } from '@angular/core';
import { FormBuilder, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { finalize } from 'rxjs';

import { ButtonModule } from 'primeng/button';
import { CalendarModule } from 'primeng/calendar';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputSwitchModule } from 'primeng/inputswitch';
import { InputTextModule } from 'primeng/inputtext';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TooltipModule } from 'primeng/tooltip';

import { AuditInfoComponent } from '../../../_shared/components/audit-info/audit-info.component';
import { LabelModule } from '../../../_shared/components/label/label.module';
import { Padrao, PadraoService } from '../../../_shared/services/api/padrao.service';
import { ToastService } from '../../../_shared/services/toast.service';

@Component({
  selector: 'padrao-dialog',
  standalone: true,
  imports: [
    CommonModule,
    DialogModule,
    AuditInfoComponent,
    ButtonModule,
    LabelModule,
    InputTextModule,
    InputTextareaModule,
    InputNumberModule,
    InputSwitchModule,
    CalendarModule,
    CheckboxModule,
    ReactiveFormsModule,
    FormsModule,
    TooltipModule,
  ],
  templateUrl: './padrao-dialog.component.html',
})
export class PadraoDialogComponent {
  private toastService = inject(ToastService);
  private formBuilder = inject(FormBuilder);
  private padraoService = inject(PadraoService);

  titulo = 'Padrão';
  header = '';
  saving = false;
  visible = false;
  selected?: Padrao;

  @Output() onSaving = new EventEmitter<Padrao>();

  form = this.formBuilder.group({
    campoInteiro: [null as number | null, [Validators.required]],
    campoTextoCurto: [''],
    campoTextoLongo: [''],
    campoData: [null as Date | null],
    campoDatahora: [null as Date | null],
    campoBoolean: [null as boolean | null],
    campoNumeric: [null as number | null],
    campoArquivo: [''],
    campoJson: [''],
  });

  onSave() {
    this.saving = true;

    const value = { ...this.form.value };

    if (value.campoJson) {
      try {
        (value as any).campoJson = JSON.parse(value.campoJson as string);
      } catch {
        (value as any).campoJson = value.campoJson;
      }
    } else {
      (value as any).campoJson = null;
    }

    this.padraoService
      .postOrPut(value, this.selected?.id)
      .pipe(finalize(() => (this.saving = false)))
      .subscribe({
        next: (ret: any) => {
          this.onSaving.emit(ret);
          this.toastService.simple(ret);
          this.visible = false;
        },
        error: (e) => this.toastService.simple(e),
      });
  }

  onArquivoChange(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1];
      this.form.patchValue({ campoArquivo: base64 });
    };
    reader.readAsDataURL(file);
  }

  show(novo: boolean) {
    this.createForm(novo);
    this.visible = true;
  }

  createForm(novo: boolean) {
    this.header = novo ? `Cadastrando ${this.titulo}` : `Editando ${this.titulo}`;

    if (novo) {
      this.selected = undefined;
      this.form.reset();
    } else {
      const patch: any = { ...this.selected };

      if (patch.campoJson && typeof patch.campoJson === 'object') {
        patch.campoJson = JSON.stringify(patch.campoJson, null, 2);
      }

      patch.campoArquivo = '';

      this.form.patchValue(patch);
    }
  }
}
