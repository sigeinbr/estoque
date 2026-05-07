import { Component, Input } from '@angular/core';

@Component({
  selector: 'loading-dialog',
  template: `
    <div class="flex justify-content-center" *ngIf="loading">
      <p-progressSpinner
        [style]="{ width: '50px', height: '50px' }"
      ></p-progressSpinner>
    </div>
  `,
})
export class LoadingDialogComponent {
  // attributes
  @Input() loading: boolean = false;
}
