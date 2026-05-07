import { NgModule } from '@angular/core';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { AppRootComponent } from './app-root.component';
import { AppRoutingModule } from './app-routing.module';
import { AppModule } from './app.module';

@NgModule({
  declarations: [AppRootComponent],
  imports: [
    AppRoutingModule,
    AppModule,
    NoopAnimationsModule,
  ],
  providers: [],
  bootstrap: [AppRootComponent],
})
export class AppRootModule {}
