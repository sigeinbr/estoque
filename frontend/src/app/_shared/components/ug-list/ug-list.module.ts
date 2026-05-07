import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { UgListComponent } from './ug-list.component';

@NgModule({
  declarations: [UgListComponent],
  imports: [CommonModule],
  exports: [UgListComponent],
})
export class UgListModule {}
