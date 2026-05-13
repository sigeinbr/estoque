import { Component, Input } from '@angular/core';

@Component({
  selector: 'label',
  standalone: false,
  template: `
    <ng-content></ng-content>
    <span id="required-icon" title="Este campo é obrigatório" *ngIf="required">
      *
    </span>
  `,
  styleUrl: './label.component.scss',
})
export class LabelComponent {
  @Input() required?: boolean = false;
}
