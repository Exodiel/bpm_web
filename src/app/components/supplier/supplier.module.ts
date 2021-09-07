import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SupplierRoutingModule } from './supplier-routing.module';
import { UpdateSupplierComponent } from './update-supplier/update-supplier.component';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { ListSupplierComponent } from './list-supplier/list-supplier.component';

import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [
    UpdateSupplierComponent,
    CreateSupplierComponent,
    ListSupplierComponent
  ],
  imports: [
    CommonModule,
    SupplierRoutingModule,
    SharedModule,
    NgxDatatableModule,
    SweetAlert2Module,
  ],
  exports: [
    UpdateSupplierComponent,
    CreateSupplierComponent,
    ListSupplierComponent
  ]
})
export class SupplierModule { }
