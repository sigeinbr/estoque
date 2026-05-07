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
    ],
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./_pages/login/login.module').then((m) => m.LoginModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule { }
