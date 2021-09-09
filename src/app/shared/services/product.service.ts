import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { ProductResponse } from '../interfaces/product/product-response';
import { ProductDTO } from '../interfaces/product/product.dto';
import { ListResponse } from '../interfaces/list-response';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(
    public httpClient: HttpClient,
    public storageService: StorageService
  ) { }

  createProduct(data: ProductDTO): Observable<ProductResponse> {
    return this.httpClient.post<ProductResponse>(`${URL}/product/create`, {...data}, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  getProducts(limit: number, offset: number): Observable<ListResponse<ProductResponse>> {
    return this.httpClient.get<ListResponse<ProductResponse>>(`${URL}/product/all`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
      params: {
        'limit': limit,
        'offset': offset
      }
    });
  }

  getProductById(id: number): Observable<ProductResponse> {
    return this.httpClient.get<ProductResponse>(`${URL}/product/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  updateProduct(id: number, body: ProductDTO): Observable<ProductResponse> {
    return this.httpClient.put<ProductResponse>(`${URL}/product/update/${id}`, { ...body }, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  deleteProductById(id: number) {
    return this.httpClient.delete(`${URL}/product/delete/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }
}
