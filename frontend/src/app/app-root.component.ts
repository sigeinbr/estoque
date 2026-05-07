import { Component, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { words } from './_shared/translations';

@Component({
  selector: 'app-root',
  template: '<router-outlet></router-outlet>',
})
export class AppRootComponent implements OnInit {
  constructor(private primengConfig: PrimeNGConfig) {}

  ngOnInit() {
    this.primengConfig.setTranslation(words);
  }
}
