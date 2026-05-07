import { Injectable } from '@angular/core';
import { TipoStorageEnum } from '../enums/tipo-storage.enum';

@Injectable({
  providedIn: 'root',
})
export class StorageService {
  constructor() {}

  // Storage base functions
  hasStorage(tipo: TipoStorageEnum, key: string): boolean {
    switch (tipo) {
      case TipoStorageEnum.Local:
        return !!localStorage.getItem(key);
      case TipoStorageEnum.Session:
        return !!sessionStorage.getItem(key);
      default:
        return false;
    }
  }

  setStorage(tipo: TipoStorageEnum, key: string, value: any) {
    switch (tipo) {
      case TipoStorageEnum.Local:
        localStorage.setItem(key, value);
        break;
      case TipoStorageEnum.Session:
        sessionStorage.setItem(key, value);
        break;
    }
  }

  getStorage(tipo: TipoStorageEnum, key: string): any {
    switch (tipo) {
      case TipoStorageEnum.Local:
        return localStorage.getItem(key) ? localStorage.getItem(key) : null;
      case TipoStorageEnum.Session:
        return sessionStorage.getItem(key) ? sessionStorage.getItem(key) : null;
    }
  }

  removeStorage(tipo: TipoStorageEnum, key: string) {
    switch (tipo) {
      case TipoStorageEnum.Local:
        localStorage.removeItem(key);
        break;
      case TipoStorageEnum.Session:
        sessionStorage.removeItem(key);
        break;
    }
  }

  removeAllStorage(tipo: TipoStorageEnum) {
    switch (tipo) {
      case TipoStorageEnum.Local:
        localStorage.clear();
        break;
      case TipoStorageEnum.Session:
        sessionStorage.clear();
        break;
    }
  }

  // Context functions
  getContext(): any {
    const context = JSON.parse(this.getStorage(TipoStorageEnum.Session, 'context'));

    return context;
  }

  setContext(item: any) {
    let context = this.getContext();

    context = { ...context, ...item };

    this.setStorage(TipoStorageEnum.Session, 'context', JSON.stringify(context));
  }

  clearContext() {
    this.removeAllStorage(TipoStorageEnum.Session);
  }

  // User functions
  getUserData(): any {
    const userData = JSON.parse(this.getStorage(TipoStorageEnum.Local, 'userData'));

    return userData;
  }

  setUserData(item: any) {
    this.setStorage(TipoStorageEnum.Local, 'userData', JSON.stringify(item));
  }

  clearUserData() {
    this.removeAllStorage(TipoStorageEnum.Local);
  }
}
