import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UserResponse } from '../../../shared/interfaces/user/user-response';
import { UserService } from '../../../shared/services/user.service';
import { UploadsService } from '../../../shared/services/uploads.service';
import { ToastrService } from 'ngx-toastr';
import { UserUpdateDTO } from '../../../shared/interfaces/user/user-update.dto';
import { environment } from '../../../../environments/environment';

const URL = environment.wsUrl;

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent implements OnInit {
  user: UserResponse = null;
  public validate = false;
  imgURL: any = '';
  public userForm: FormGroup;
  file: File = null;
  constructor(
    private userService: UserService,
    private fb: FormBuilder,
    public toster: ToastrService,
    private uploadService: UploadsService,
  ) { }

  ngOnInit(): void {
    this.userService.getLoggedUser().subscribe(
      (data) => {
        this.user = data;
        // this.imgURL = data.image;
        this.userForm = this.fb.group({
          email: [data.email, [Validators.required, Validators.email]],
          name: [data.name, [Validators.required, Validators.minLength(3)]],
          address: [data.address, [Validators.required, Validators.minLength(3)]],
          phone: [data.phone, [Validators.required, Validators.minLength(10)]],
          identification: [data.identification, [Validators.required, Validators.minLength(10), Validators.maxLength(13)]]
        });
      },
      (error: HttpErrorResponse) => {

      }
    );
  }
  
  onChange(event) {
    this.file = (event.target as HTMLInputElement).files[0];
    const mimeType = this.file.type;
    if (mimeType.match(/image\/*/) == null) {
      this.toster.warning("Solo son soportadas imagenes");
      return;
    }
    const reader = new FileReader();
    reader.readAsDataURL(this.file);
    reader.onload = (_event) => { 
      this.user.image = reader.result as string;
    }
  }

  submit() {
    this.validate = !this.validate;
    if (this.validate) {
      const body = <UserUpdateDTO>{
        name: this.userForm.value['name'],
        identification: this.userForm.value['identification'],
        email: this.userForm.value['email'],
        phone: this.userForm.value['phone'],
        address: this.userForm.value['address'],
        identification_type: this.user.identification_type,
        username: this.user.username,
        rol: this.user.rol,
        type: this.user.type,
        active: this.user.active,
        id: this.user.id,
        image: this.user.image
      }
      if (this.file != null) {

        this.uploadService.uploadImage(this.file).subscribe(
          (data) => {
            body.image = `${URL}/` + data.filepath,
            this.editUser(body);
          },
          (httpError: HttpErrorResponse) => {
            this.toster.error(httpError.error['message']);
          }
        );
      } else {
        this.editUser(body);
      }
    }
  }

  editUser(body: UserUpdateDTO){
    this.userService.updateUser(body).subscribe(
      (data) => {
        this.toster.success('Datos actualizados correctamente');
      },
      (httpError: HttpErrorResponse) => {
        this.toster.error(httpError.error['message']);
      }
    );
  }

}
