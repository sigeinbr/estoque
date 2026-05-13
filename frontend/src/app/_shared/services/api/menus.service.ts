import { LocationStrategy } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ResourceService } from './_resource.service';

export interface Menu {
  id: string;
  menuPaiId: string | null;
  label: string;
  routerLink?: string | null;
  icon: string;
  disabled?: boolean;
  command?: () => void;
  items?: Menu[];
}

@Injectable({
  providedIn: 'root',
})
export class MenusService extends ResourceService<Menu> {
  constructor(httpClient: HttpClient, locationStrategy: LocationStrategy) {
    super(httpClient, locationStrategy, 'menus');
  }
}
