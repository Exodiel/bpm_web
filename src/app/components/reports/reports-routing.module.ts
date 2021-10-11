import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { OrdersComponent } from './orders/orders.component';
import { AdminGuard } from '../../shared/guard/admin.guard';
import { DispatcherGuard } from '../../shared/guard/dispatcher.guard';
import { SellerGuard } from '../../shared/guard/seller.guard';
import { StorekeeperGuard } from '../../shared/guard/storekeeper.guard';
import { ProductsComponent } from './products/products.component';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'orders',
        component: OrdersComponent,
        canActivate: [AdminGuard, DispatcherGuard, SellerGuard, StorekeeperGuard],
      },
      {
        path: 'products',
        component: ProductsComponent,
        canActivate: [AdminGuard, DispatcherGuard, SellerGuard, StorekeeperGuard],
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ReportsRoutingModule { }
