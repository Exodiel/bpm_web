import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { ListResponse } from '../interfaces/list-response';
import { OrderResponse } from '../interfaces/order/order-response';
import { OrderDTO } from '../interfaces/order/order.dto';
import { DetailDTO } from '../interfaces/detail/detail.dto';
import { OrderReportDto } from '../interfaces/reports/order-report.dto';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class OrderService {

  constructor(
    private httpClient: HttpClient,
    private storageService: StorageService
  ) { }

  getOrders(limit: number, offset: number): Observable<ListResponse<OrderResponse>> {
    return this.httpClient.get<ListResponse<OrderResponse>>(`${URL}/order/all`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
      params: {
        'limit': limit,
        'offset': offset
      }
    });
  }

  createOrder(data: OrderDTO): Observable<OrderResponse> {
    return this.httpClient.post<OrderResponse>(`${URL}/order/create`, {...data}, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  createDetails(data: DetailDTO[]): Observable<{ message: string }> {
    return this.httpClient.post<{ message: string }>(`${URL}/detail/create`, {data}, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  deleteOrderById(id: number) {
    return this.httpClient.delete(`${URL}/order/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  getOrderById(id: number): Observable<OrderResponse> {
    return this.httpClient.get<OrderResponse>(`${URL}/order/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  updateOrder(id: number, data: OrderDTO): Observable<OrderResponse> {
    return this.httpClient.put<OrderResponse>(`${URL}/order/update/${id}`, {...data}, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  reportOrder(data: OrderReportDto): Observable<Array<OrderResponse>> {
    return this.httpClient.post<Array<OrderResponse>>(`${URL}/order/get-transactions`, {...data}, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  findOrders(): Observable<Array<OrderResponse>> {
    return this.httpClient.get<Array<OrderResponse>>(`${URL}/order/find`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }
}
