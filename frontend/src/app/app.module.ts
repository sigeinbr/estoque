import { registerLocaleData } from '@angular/common';
import { APP_INITIALIZER } from '@angular/core';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import localePT from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';
import { MenubarModule } from 'primeng/menubar';
import { ToastModule } from 'primeng/toast';
import { ModuloListModule } from './_shared/components/modulo-list/modulo-list.module';
import { UgListModule } from './_shared/components/ug-list/ug-list.module';
import { ConsultaBuscarDialogComponent } from './features/consultas/consulta-buscar-dialog/consulta-buscar-dialog.component';
import { RelatorioBuscarDialogComponent } from './features/relatorios/relatorio-buscar-dialog/relatorio-buscar-dialog.component';
import { JwtTokenInterceptor } from './_shared/interceptors/jwt-token.interceptor';
import { AppConfigService } from './_shared/services/app-config.service';
import { AppComponent } from './app.component';

registerLocaleData(localePT);

export function initializeAppConfig(appConfigService: AppConfigService) {
  return () => appConfigService.load();
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    HttpClientModule,
    ReactiveFormsModule,
    BrowserModule,
    RouterModule,
    ButtonModule,
    ToastModule,
    InputTextModule,
    MenuModule,
    MenubarModule,
    DropdownModule,
    DialogModule,
    UgListModule,
    ModuloListModule,
    ConsultaBuscarDialogComponent,
    RelatorioBuscarDialogComponent,
  ],
  providers: [
    MessageService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeAppConfig,
      deps: [AppConfigService],
      multi: true,
    },
    { provide: HTTP_INTERCEPTORS, useClass: JwtTokenInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
