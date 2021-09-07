import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';
import { CategoryResponse } from '../interfaces/category/category-response';
import { CategoryDTO } from '../interfaces/category/category.dto';
import { ListResponse } from '../interfaces/list-response';
import { CategoryUpdateDTO } from '../interfaces/category/category-update.dto';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class CategoryService {

  constructor(
    public httpClient: HttpClient,
    public storageService: StorageService
  ) { }

  createCategory(data: CategoryDTO): Observable<CategoryResponse> {
    return this.httpClient.post<CategoryResponse>(`${URL}/category/create`, {...data}, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  getCategories(limit: number, offset: number): Observable<ListResponse<CategoryResponse>> {
    return this.httpClient.get<ListResponse<CategoryResponse>>(`${URL}/category/all`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
      params: {
        'limit': limit,
        'offset': offset
      }
    });
  }

  getCategoryById(id: number) : Observable<CategoryResponse> {
    return this.httpClient.get<CategoryResponse>(`${URL}/category/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  updateCategory(data: CategoryUpdateDTO): Observable<CategoryResponse> {
    return this.httpClient.put<CategoryResponse>(`${URL}/category/update/${data.id}`, {
      ...data
    }, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    },);
  }

  deleteCategoryById(id: number) {
    return this.httpClient.delete(`${URL}/category/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }
}
