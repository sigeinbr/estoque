import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'login-escolher-ug',
  templateUrl: './escolher-ug.component.html',
  host: { class: 'login' },
})
export class EscolherUgComponent {
  constructor(private router: Router) {}

  onEscolherUg() {
    this.router.navigate(['/']);
  }
}
