import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { CookieService } from 'ngx-cookie-service';
import { environment } from '../../../../environments/environment';
import { LoginResponse } from '../../interfaces/login-response.interface';

const URL = environment.apiUrl;

@Injectable({
  providedIn: 'root'
})
export class AuthLocalService {

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
    public router: Router,
  ) { }

  SignIn(email: string, password: string) {
    return this.httpClient.post<LoginResponse>(`${URL}/auth/login`, {
      email,
      password
    });
  }

  SignUp(name: string, email: string, password: string, rol: string, type: string) {
    return this.httpClient.post<LoginResponse>(`${URL}/auth/register`, {
      name,
      email,
      password,
      rol,
      type
    });
  }

  SignOut() {
    this.router.routeReuseStrategy.shouldReuseRoute = function () {
      return false;
    };
    localStorage.clear();
    this.cookieService.deleteAll('user', '/auth/login');
    this.router.navigate(['/auth/login']);
    location.reload();
  }

  get isLoggedIn(): boolean {
    const user = JSON.parse(localStorage.getItem('user'));
    return (user != null && user.token) ? true : false;
  }
}
