import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CategoryRoutingModule } from './category-routing.module';
import { ListCategoryComponent } from './list-category/list-category.component';

import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CreateCategoryComponent } from './create-category/create-category.component';
import { UpdateCategoryComponent } from './update-category/update-category.component';


@NgModule({
  declarations: [
    ListCategoryComponent,
    CreateCategoryComponent,
    UpdateCategoryComponent
  ],
  imports: [
    CommonModule,
    CategoryRoutingModule,
    SharedModule,
    NgxDatatableModule,
    SweetAlert2Module,
  ],
  exports: [
    ListCategoryComponent,
    CreateCategoryComponent
  ]
})
export class CategoryModule { }
