import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { ListSupplierComponent } from './list-supplier/list-supplier.component';
import { UpdateSupplierComponent } from './update-supplier/update-supplier.component';
import { AdminGuard } from '../../shared/guard/admin.guard';
import { SellerGuard } from '../../shared/guard/seller.guard';
import { StorekeeperGuard } from '../../shared/guard/storekeeper.guard';
import { DispatcherGuard } from '../../shared/guard/dispatcher.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create-supplier',
        component: CreateSupplierComponent,
        canActivate: [AdminGuard, SellerGuard, StorekeeperGuard, DispatcherGuard],
      },
      {
        path: 'list-supplier',
        component: ListSupplierComponent,
        canActivate: [AdminGuard, SellerGuard, StorekeeperGuard, DispatcherGuard],
      },
      {
        path: 'update-supplier/:id',
        component: UpdateSupplierComponent,
        canActivate: [AdminGuard, SellerGuard, StorekeeperGuard, DispatcherGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
