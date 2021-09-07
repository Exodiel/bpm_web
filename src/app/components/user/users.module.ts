import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { CreateUserComponent } from './create-user/create-user.component';
import { UsersRoutingModule } from './users-routing.module';
import { ListUserComponent } from './list-user/list-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';

@NgModule({
  declarations: [
    CreateUserComponent,
    ListUserComponent,
    UpdateUserComponent
  ],
  imports: [
    CommonModule,
    UsersRoutingModule,
    SharedModule,
    NgxDatatableModule,
    SweetAlert2Module
  ],
  exports: [
    CreateUserComponent,
    ListUserComponent,
    UpdateUserComponent
  ]
})
export class UsersModule { }
