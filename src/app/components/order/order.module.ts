import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { OrderRoutingModule } from './order-routing.module';
import { ListOrderComponent } from './list-order/list-order.component';
import { CreateOrderComponent } from './create-order/create-order.component';
import { UpdateOrderComponent } from './update-order/update-order.component';



@NgModule({
  declarations: [
    ListOrderComponent,
    CreateOrderComponent,
    UpdateOrderComponent
  ],
  imports: [
    CommonModule,
    SharedModule,
    NgxDatatableModule,
    SweetAlert2Module,
    OrderRoutingModule
  ],
  exports: [
    ListOrderComponent,
    CreateOrderComponent,
    UpdateOrderComponent
  ]
})
export class OrderModule { }
