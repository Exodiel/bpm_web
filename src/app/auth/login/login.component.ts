import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ExceptionResponse } from '../../shared/interfaces/exception-response';
import { LoginResponse } from '../../shared/interfaces/login-response.interface';
import { AuthService } from '../../shared/services/firebase/auth.service';
import { AuthLocalService } from '../../shared/services/local/auth-local.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit, OnDestroy {

  public show: boolean = false;
  public showLoader: boolean = false;
  public loginForm: FormGroup;
  public errorMessage: string;

  loginObserver$: Observable<LoginResponse>;
  loginSubscription: Subscription;

  constructor(
    public authService: AuthService,
    private fb: FormBuilder,
    public authLocalService: AuthLocalService,
    private cookieService: CookieService,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
  ) {
      this.loginForm = this.fb.group({
        email: ['jipson09saad@gmail.com', [Validators.required, Validators.email]],
        password: ['123456', [Validators.required, Validators.minLength(4)]]
      });
  }

  ngOnInit() {
  }

  ngOnDestroy() {
    this.loginSubscription?.unsubscribe();
  }

  showPassword() {
    this.show = !this.show;
  }
  
  // Login With Google
  loginGoogle() {
    this.authService.GoogleAuth();
  }

  // Login With Twitter
  loginTwitter(): void {
    this.authService.signInTwitter();
  }

  // Login With Facebook
  loginFacebook() {
    this.authService.signInFacebok();
  }

  // Simple Login
  login() {
    this.authService.SignIn(this.loginForm.value['email'], this.loginForm.value['password']);
  }

  localLogin() {
    this.loginObserver$ = this.authLocalService.SignIn(this.loginForm.value['email'], this.loginForm.value['password']);

    this.loginSubscription = this.loginObserver$.subscribe(
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
