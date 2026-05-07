import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { VisualizarPerfilComponent } from './visualizar-perfil.component';

const routes: Routes = [{ path: '', component: VisualizarPerfilComponent }];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class VisualizarPerfilRoutingModule {}
