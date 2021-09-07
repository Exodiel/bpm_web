import { Component, NgZone, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, Subscription } from 'rxjs';
import { UserResponse } from '../../../shared/interfaces/user/user-response';
import { UserService } from '../../../shared/services/user.service';
import * as faker from 'faker';
import { HttpErrorResponse } from '@angular/common/http';
import { UserUpdateDTO } from '../../../shared/interfaces/user/user-update.dto';

@Component({
  selector: 'app-update-supplier',
  templateUrl: './update-supplier.component.html',
  styleUrls: ['./update-supplier.component.css']
})
export class UpdateSupplierComponent implements OnInit {
  id: number;
  public validate = false;
  public tooltipValidation = false;
  public updateUserForm: FormGroup;
  updateUserObserver$: Observable<UserResponse>;
  updateUserSubscription: Subscription;
  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    public router: Router,
    public ngZone: NgZone,
    public toster: ToastrService,
    private fb: FormBuilder,
  ) { }

  ngOnInit(): void {
    this.id = this.route.snapshot.params['id'];
    this.userService.getUserById(this.id).subscribe(
      (data) => {

        this.updateUserForm = this.fb.group({
          email: [data.email, [Validators.required, Validators.email]],
          name: [data.name, [Validators.required, Validators.minLength(3)]],
          address: [data.address, [Validators.required, Validators.minLength(3)]],
          phone: [data.phone, [Validators.required, Validators.minLength(10)]],
          identification: [data.identification, [Validators.required, Validators.minLength(10), Validators.maxLength(13)]],
        });

      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.error['message']);
      }
    );
  }

  public submit() {
    this.validate = !this.validate;
    if (this.validate) {
      const data = <UserUpdateDTO>{
        id:                   this.id,
        name:                 this.updateUserForm.value['name'],
        username:             this.updateUserForm.value['email'],
        email:                this.updateUserForm.value['email'],
        password:             this.updateUserForm.value['identification'],
        rol:                  'proveedor',
        identification:       this.updateUserForm.value['identification'],
        identification_type: `${this.updateUserForm.value['identification']}`.length == 10 ? 'cedula' : 'ruc',
        active:               1,
        address:              this.updateUserForm.value['address'],
        phone:                this.updateUserForm.value['phone'],
        type:                 'supplier',
        image:                faker.internet.avatar()
      };

      this.updateUserObserver$ = this.userService.updateUser(data);

      this.updateUserSubscription = this.updateUserObserver$.subscribe(
        (response) => {
          this.toster.success("Proveedor actualizado correctamente!");
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

}
