import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ModuloListComponent } from './modulo-list.component';

@NgModule({
  declarations: [ModuloListComponent],
  imports: [CommonModule],
  exports: [ModuloListComponent],
})
export class ModuloListModule {}
