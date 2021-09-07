import { Component, OnInit, NgZone } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UserResponse } from '../../../shared/interfaces/user/user-response';
import { UserDTO } from '../../../shared/interfaces/user/user-dto.interface';
import { UserService } from '../../../shared/services/user.service';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { HttpErrorResponse } from '@angular/common/http';
import * as faker from 'faker';

@Component({
  selector: 'app-create-user',
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss']
})
export class CreateUserComponent implements OnInit {
  public validate = false;
  public tooltipValidation = false;
  public createUserForm: FormGroup;
  createUserObserver$: Observable<UserResponse>;
  createUserSubscription: Subscription;
  constructor(
    private userService: UserService,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.createUserForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(4)]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      username: ['', [Validators.required, Validators.minLength(3)]],
      rol: ['', Validators.required],
      identification: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
    });
  }
   
  public submit() {
    this.validate = !this.validate;
    if (this.validate) {
      const data = <UserDTO>{
        name:                 this.createUserForm.value['name'],
        username:             this.createUserForm.value['username'],
        email:                this.createUserForm.value['email'],
        password:             this.createUserForm.value['password'],
        rol:                  this.createUserForm.value['rol'],
        identification:       this.createUserForm.value['identification'],
        identification_type: `${this.createUserForm.value['identification']}`.length == 10 ? 'cedula' : 'ruc',
        active:               1,
        type:                 'user',
        image:                faker.internet.avatar()
      };

      this.createUserObserver$ = this.userService.createUser(data);

      this.createUserSubscription = this.createUserObserver$.subscribe(
        (data) => {
          this.toster.success("Usuario creado correctamente");
          this.ngZone.run(() => {
            this.router.navigate(['/users/list-user']);
          });
        },
        (httpError: HttpErrorResponse) => {
          this.toster.error(httpError.error['message']);
        }
      );
    }
  }
  public tooltipSubmit() {
    this.tooltipValidation = !this.tooltipValidation;
  }

}
