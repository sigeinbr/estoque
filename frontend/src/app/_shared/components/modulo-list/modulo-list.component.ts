import { Component, EventEmitter, Output } from '@angular/core';
import { Router } from '@angular/router';
import {
  LogAcesso,
  LogAcessosService,
} from '../../services/api/log-acessos.service';
import { Modulo } from '../../services/api/modulos.service';
import { UgsService } from '../../services/api/ugs.service';
import { StorageService } from '../../services/storage.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'modulo-list',
  templateUrl: './modulo-list.component.html',
  styleUrl: './modulo-list.component.scss',
})
export class ModuloListComponent {
  modulos: Modulo[] = [];

  @Output() onModuloChange = new EventEmitter<Modulo>();

  constructor(
    private storageService: StorageService,
    private router: Router,
    private logAcessosService: LogAcessosService,
    private toastService: ToastService,
    private ugsService: UgsService
  ) {}

  // angular events
  ngOnInit() {
    this.loadModulos();
  }

  // events functions
  onEscolherModulo(modulo: Modulo) {
    this.storageService.setContext({ modulo: modulo });

    // Registra o log de acesso da home com alteração de contexto quando a escolha for dentro da aplicação
    if (this.router.url == '/') {
      this.logAcessosService
        .postOrPut(<LogAcesso>{ rota: '/' })
        .subscribe({
          error: (e) => this.toastService.simple(e),
        });
    } else {
      this.router.navigate(['/']);
    }

    this.onModuloChange.emit(modulo);
  }

  // internal functions
  loadModulos() {
    this.ugsService
      .getAll(null, '/modulos')
      .subscribe({
        next: (ret: any) => {
          this.modulos = ret.data.map((item: any) => {
            return {
              id: item.modulo_id,
              descricao: item.descricao,
            } as Modulo;
          });
        },
      });
  }
}
