import { Component, OnDestroy, OnInit, NgZone } from '@angular/core';
import { FormBuilder, Validators, FormGroup } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { ExceptionResponse } from '../../shared/interfaces/exception-response';
import { LoginResponse } from '../../shared/interfaces/login-response.interface';
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
    private fb: FormBuilder,
    public authLocalService: AuthLocalService,
    private cookieService: CookieService,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]]
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
