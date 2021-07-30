import { Component } from '@angular/core';

@Component({
  selector: 'app-dashboard',
  templateUrl: 'login.component.html'
})
export class LoginComponent {
  email: string = '';
  password: string = '';

  submit(loginData) {
    console.log(loginData);
  }
}
