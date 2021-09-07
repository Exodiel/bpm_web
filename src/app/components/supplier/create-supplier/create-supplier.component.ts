import { Component, NgZone, OnInit } from '@angular/core';
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
  selector: 'app-create-supplier',
  templateUrl: './create-supplier.component.html',
  styleUrls: ['./create-supplier.component.css']
})
export class CreateSupplierComponent implements OnInit {
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
      name: ['', [Validators.required, Validators.minLength(3)]],
      address: ['', [Validators.required, Validators.minLength(3)]],
      phone: ['', [Validators.required, Validators.minLength(10)]],
      identification: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
    });
  }

  public submit() {
    this.validate = !this.validate;
    if (this.validate) {
      const data = <UserDTO>{
        name:                 this.createUserForm.value['name'],
        username:             this.createUserForm.value['email'],
        email:                this.createUserForm.value['email'],
        password:             this.createUserForm.value['identification'],
        rol:                  'proveedor',
        identification:       this.createUserForm.value['identification'],
        identification_type: `${this.createUserForm.value['identification']}`.length == 10 ? 'cedula' : 'ruc',
        active:               1,
        address:              this.createUserForm.value['address'],
        phone:                this.createUserForm.value['phone'],
        type:                 'supplier',
        image:                faker.internet.avatar()
      };

      this.createUserObserver$ = this.userService.createUser(data);

      this.createUserSubscription = this.createUserObserver$.subscribe(
        (data) => {
          this.toster.success("Proveedor creado correctamente");
          this.ngZone.run(() => {
            this.router.navigate(['/suppliers/list-supplier']);
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
