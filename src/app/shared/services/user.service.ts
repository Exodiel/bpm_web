import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { UserResponse } from '../interfaces/user/user-response';
import { UserDTO } from '../interfaces/user/user-dto.interface';
import { UserUpdateDTO } from '../interfaces/user/user-update.dto';
import { ListResponse } from '../interfaces/list-response';
import { Observable } from 'rxjs';
import { StorageService } from './storage.service';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class UserService {
  
  constructor(
    public httpClient: HttpClient,
    public storageService: StorageService
  ) {
  }

  createUser(data: UserDTO): Observable<UserResponse> {
    return this.httpClient.post<UserResponse>(`${URL}/user/create`, {...data}, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  getUsers(limit: number, offset: number, type: string): Observable<ListResponse<UserResponse>> {
    return this.httpClient.get<ListResponse<UserResponse>>(`${URL}/user/all`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      },
      params: {
        'limit': limit,
        'offset': offset,
        'type': type
      }
    });
  }

  getLoggedUser(): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${URL}/user/${this.storageService.id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  deleteUserById(id: number) {
    return this.httpClient.delete(`${URL}/user/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  getUserById(id: number): Observable<UserResponse> {
    return this.httpClient.get<UserResponse>(`${URL}/user/${id}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  getUserByType(type: string): Observable<UserResponse[]> {
    return this.httpClient.get<UserResponse[]>(`${URL}/user/search?type=${type}`, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    });
  }

  updateUser(data: UserUpdateDTO): Observable<UserResponse> {
    return this.httpClient.put<UserResponse>(`${URL}/user/update/${data.id}`, {
      ...data
    }, {
      headers: {
        'Authorization': `Bearer ${this.storageService.token}`
      }
    },);
  }
}
