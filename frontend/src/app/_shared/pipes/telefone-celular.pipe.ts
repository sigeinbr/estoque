import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'telefoneCelular',
  standalone: true,
})
export class TelefoneCelularPipe implements PipeTransform {
  transform(value: string | null | undefined, ...args: any[]): any {
    if (!value) return '';

    if (value.length === 11) {
      return value.replace(/(\d{2})(\d{5})(\d{4})/g, '($1) $2-$3');
    } else if (value.length === 10) {
      return value.replace(/(\d{2})(\d{4})(\d{4})/g, '($1) $2-$3');
    } else if (value.length === 9) {
      return value.replace(/(\d{5})(\d{4})/g, '$1-$2');
    }

    return '';
  }
}
