import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { LoadingDialogComponent } from './loading-dialog.component';

@NgModule({
  declarations: [LoadingDialogComponent],
  imports: [CommonModule, ProgressSpinnerModule],
  exports: [LoadingDialogComponent],
})
export class LoadingDialogModule {}
