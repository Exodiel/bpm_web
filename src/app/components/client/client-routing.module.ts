import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../shared/guard/admin.guard';
import { SellerGuard } from '../../shared/guard/seller.guard';
import { StorekeeperGuard } from '../../shared/guard/storekeeper.guard';
import { DispatcherGuard } from '../../shared/guard/dispatcher.guard';
import { CreateClientComponent } from './create-client/create-client.component';
import { ListClientComponent } from './list-client/list-client.component';
import { UpdateClientComponent } from './update-client/update-client.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create-client',
        component: CreateClientComponent,
        canActivate: [AdminGuard, SellerGuard, StorekeeperGuard, DispatcherGuard],
      },
      {
        path: 'list-client',
        component: ListClientComponent,
        canActivate: [AdminGuard, SellerGuard, StorekeeperGuard, DispatcherGuard],
      },
      {
        path: 'update-client/:id',
        component: UpdateClientComponent,
        canActivate: [AdminGuard, SellerGuard, StorekeeperGuard, DispatcherGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
