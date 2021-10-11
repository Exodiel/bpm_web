import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ProfileRoutingModule } from './profile-routing.module';
import { UserComponent } from './user/user.component';
import { SharedModule } from '../../shared/shared.module';


@NgModule({
  declarations: [
    UserComponent
  ],
  imports: [
    CommonModule,
    ProfileRoutingModule,
    SharedModule
  ],
  exports: [
    UserComponent
  ]
})
export class ProfileModule { }
