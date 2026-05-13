import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_shared/services/api/_auth/auth.guard';
import { AppComponent } from './app.component';

const routes: Routes = [
  {
    path: '',
    component: AppComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./_dashboard/dashboard.module').then(
            (m) => m.DashboardModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'visualizar-perfil',
        loadChildren: () =>
          import('./visualizar-perfil/visualizar-perfil.module').then(
            (m) => m.VisualizarPerfilModule
          ),
        canActivate: [AuthGuard],
      },
      {
        path: 'padrao',
        loadComponent: () =>
          import('./features/padrao/padrao.component').then((m) => m.PadraoComponent),
        canActivate: [AuthGuard],
      },
      { path: 'consultas', redirectTo: '', pathMatch: 'full' },
      { path: 'relatorios', redirectTo: '', pathMatch: 'full' },
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./_pages/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'consulta-resultado',
    loadComponent: () =>
      import(
        './features/consultas/consulta-resultado/consulta-resultado.component'
      ).then((m) => m.ConsultaResultadoComponent),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
