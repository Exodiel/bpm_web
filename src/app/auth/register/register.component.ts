import { Component, NgZone, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { LoginResponse } from '../../shared/interfaces/login-response.interface';
import { AuthLocalService } from '../../shared/services/local/auth-local.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit, OnDestroy {

  public show: boolean = false;
  public showLoader: boolean = false;
  public registerForm: FormGroup;
  public errorMessage: string;

  registerObserver$: Observable<LoginResponse>;
  registerSubscription: Subscription;
  constructor(
    private fb: FormBuilder,
    public authLocalService: AuthLocalService,
    private cookieService: CookieService,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
  ) {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required]
    });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.registerSubscription?.unsubscribe();
  }

  showPassword() {
    this.show = !this.show;
  }

  localRegister() {
    this.registerObserver$ = this.authLocalService.SignUp(
      `${this.registerForm.value['firstName']} ${this.registerForm.value['lastName']}`,
      this.registerForm.value['email'],
      this.registerForm.value['password'],
      'admin',
      'user'
    );

    this.registerSubscription = this.registerObserver$.subscribe(
      (data) => {
        
        this.showLoader = false;
        let userData = {
          token: data["accessToken"],
          id: data["user"]["id"],
          rol: data["user"]["rol"],
        }

        this.cookieService.set('user', JSON.stringify(userData));
        localStorage.setItem('user', JSON.stringify(userData));

        this.ngZone.run(() => {
          this.router.navigate(['/dashboard/default']);
        });
      },
      (httpError: HttpErrorResponse) => {
        this.showLoader = true;
        this.errorMessage = httpError.error["message"];

        this.toster.error(this.errorMessage);
      }
    );
  }
}
