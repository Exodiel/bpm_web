import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ReportsRoutingModule } from './reports-routing.module';
import { OrdersComponent } from './orders/orders.component';
import { ProductsComponent } from './products/products.component';

import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';


@NgModule({
  declarations: [
    OrdersComponent,
    ProductsComponent,
  ],
  imports: [
    CommonModule,
    ReportsRoutingModule,
    CommonModule,
    SharedModule,
    NgxDatatableModule,
  ]
})
export class ReportsModule { }
