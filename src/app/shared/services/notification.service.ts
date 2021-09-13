import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { ListResponse } from '../interfaces/list-response';
import { NotificationResponse } from '../interfaces/notification/notification-response';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) { }

  getAll(limit: number, offset: number) {
    return this.httpClient.get<ListResponse<NotificationResponse>>(`${URL}/notification/all`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
      params: {
        'limit': limit,
        'offset': offset
      }
    });
  }

  deleteONotificacionById(id: number): Observable<{ message: string; }> {
    return this.httpClient.delete<{ message: string; }>(`${URL}/notification/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
    });
  }
}
