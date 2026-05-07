import { Component, EventEmitter, Output } from '@angular/core';
import { Ug } from '../../services/api/ugs.service';
import { UsuariosService } from '../../services/api/usuarios.service';
import { StorageService } from '../../services/storage.service';
import { ToastService } from '../../services/toast.service';

@Component({
  selector: 'ug-list',
  templateUrl: './ug-list.component.html',
  styleUrl: './ug-list.component.scss',
})
export class UgListComponent {
  ugs: Ug[] | undefined;

  @Output() onUgChange = new EventEmitter<Ug>();

  constructor(
    private storageService: StorageService,
    private toastService: ToastService,
    private usuariosService: UsuariosService
  ) {}

  // angular events
  ngOnInit() {
    this.loadUgs();
  }

  // events functions
  onEscolherUg(ug: Ug) {
    this.storageService.clearContext();
    this.storageService.setContext({ ug: ug });

    this.loadUsuariosMenus(ug);
  }

  // internal functions
  loadUgs() {
    this.usuariosService
      .getAll(null, '/ugs')
      .subscribe({
        next: (ret: any) => {
          this.ugs = ret.data.map((item: any) => {
            return {
              id: item.id,
              nome: item.nome,
            } as Ug;
          });
        },
      });
  }

  loadUsuariosMenus(ug: Ug) {
    this.usuariosService.getAll(null, '/menus').subscribe({
      next: (ret: any) => {
        this.storageService.setUserData({ usuarioMenus: ret.data });

        this.onUgChange.emit(ug);
      },
      error: (e) => this.toastService.simple(e),
    });
  }
}
