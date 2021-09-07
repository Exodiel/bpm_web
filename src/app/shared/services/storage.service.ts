import { Injectable } from '@angular/core';
import { Storage } from '../interfaces/storage.interface';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private user: Storage;
  constructor() {
    this.user = JSON.parse(localStorage.getItem("user"));
  }

  get id(): number {
    return this.user.id;
  }

  get token(): string {
    return this.user.token;
  }

  get rol(): string {
    return this.user.rol;
  }
}
