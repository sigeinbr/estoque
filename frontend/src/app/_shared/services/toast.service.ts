import { Injectable } from '@angular/core';
import { MessageService } from 'primeng/api';

/**
 * Classe utilizada para emissão de mensagens toast
 * Basta fazer um injection no construtor do componente que deseja utilizar
 *
 */
@Injectable({
  providedIn: 'root',
})
export class ToastService {
  timeToClose: number = 3000;
  private constraintMessages: Record<string, string> = {};

  constructor(private messageService: MessageService) { }

  simple(msg: any) {
    const severity = msg?.details ? msg.details.type ?? 'error' : msg?.type ?? 'error';
    const rawDetail = msg?.details ? msg.details.message : msg?.message ?? msg?.error?.message ?? msg?.error?.detail ?? msg;
    const detail = this.translate(rawDetail);

    this.messageService.add({
      severity: severity,
      detail: detail,
      life: this.timeToClose,
    });
  }

  private translate(detail: any): string {
    const text = typeof detail === 'string'
      ? detail
      : detail?.message ?? detail?.error?.message ?? detail?.error?.detail ?? detail ?? '';

    const uniqueConstraintRegex = /duplicate key value violates unique constraint "([^"]+)"/i;
    const uniqueMatch = typeof text === 'string' ? text.match(uniqueConstraintRegex) : null;
    if (uniqueMatch) {
      const [, constraint] = uniqueMatch;

      const parsedConstraint = this.constraintMessages[constraint];
      if (parsedConstraint) {
        return parsedConstraint;
      }

      const ukeyMatch = constraint.match(/^(.*)_ukey_(.*)$/i);
      if (ukeyMatch) {
        const [, table, field] = ukeyMatch;
        const tableLabel = table.replace(/_/g, ' ');
        const fieldLabel = field.replace(/_/g, ' ');
        return `Já existe registro em "${tableLabel}" com o valor de "${fieldLabel}".`;
      }

      return 'Registro já existe com os dados informados.';
    }

    const fkRegex = /update or delete on table "([^"]+)" violates foreign key constraint "[^"]+" on table "([^"]+)"/i;
    const match = typeof text === 'string' ? text.match(fkRegex) : null;
    if (match) {
      const [, source, target] = match;
      return `Não é possível excluir/alterar registros de "${source}": existem registros relacionados em "${target}".`;
    }

    return text || 'Erro ao processar sua solicitação.';
  }
}
