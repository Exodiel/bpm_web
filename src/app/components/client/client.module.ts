import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ClientRoutingModule } from './client-routing.module';
import { ListClientComponent } from './list-client/list-client.component';
import { CreateClientComponent } from './create-client/create-client.component';
import { UpdateClientComponent } from './update-client/update-client.component';

import { SharedModule } from '../../shared/shared.module';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';


@NgModule({
  declarations: [
    ListClientComponent,
    CreateClientComponent,
    UpdateClientComponent
  ],
  imports: [
    CommonModule,
    ClientRoutingModule,
    SharedModule,
    NgxDatatableModule,
    SweetAlert2Module,
  ],
  exports: [
    ListClientComponent,
    CreateClientComponent,
    UpdateClientComponent
  ]
})
export class ClientModule { }
