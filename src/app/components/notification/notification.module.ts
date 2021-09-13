import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationRoutingModule } from './notification-routing.module';
import { ListNotificationComponent } from './list-notification/list-notification.component';
import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [
    ListNotificationComponent
  ],
  imports: [
    CommonModule,
    NotificationRoutingModule,
    SharedModule,
    NgxDatatableModule,
    SweetAlert2Module,
  ],
  exports: [ListNotificationComponent]
})
export class NotificationModule { }
