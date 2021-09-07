import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductRoutingModule } from './product-routing.module';

import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { ListProductComponent } from './list-product/list-product.component';
import { CreateProductComponent } from './create-product/create-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';



@NgModule({
  declarations: [
    ListProductComponent,
    CreateProductComponent,
    UpdateProductComponent
  ],
  imports: [
    CommonModule,
    ProductRoutingModule,
    SharedModule,
    NgxDatatableModule,
    SweetAlert2Module
  ],
  exports: [ListProductComponent, CreateProductComponent, UpdateProductComponent]
})
export class ProductModule { }
