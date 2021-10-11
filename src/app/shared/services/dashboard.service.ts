import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { TotalsByActualAndPastMonth, TotalsByYears, CountersByState, TotalsByMonth } from '../interfaces/dashboard/dashboard-reponse';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(
    public httpClient: HttpClient,
    public storageService: StorageService
  ) { }

  getTotalsMonth(): Observable<TotalsByActualAndPastMonth> {
    return this.httpClient.get<TotalsByActualAndPastMonth>(`${URL}/order/get-total-month/Venta/devuelto`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
    });
  }

  getTotalsByYears(): Observable<TotalsByYears> {
    return this.httpClient.get<TotalsByYears>(`${URL}/order/get-totals-year/Venta/devuelto`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
    });
  }

  getCountersByState(): Observable<CountersByState> {
    return this.httpClient.get<CountersByState>(`${URL}/order/get-counters/Venta`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
    });
  }

  getTotalsByMonth(): Observable<TotalsByMonth> {
    return this.httpClient.get<TotalsByMonth>(`${URL}/order/find-totals-by-month/Venta/devuelto`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
    });
  }
}
