import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../shared/guard/admin.guard';
import { SellerGuard } from '../../shared/guard/seller.guard';
import { StorekeeperGuard } from '../../shared/guard/storekeeper.guard';
import { DispatcherGuard } from '../../shared/guard/dispatcher.guard';
import { CreateOrderComponent } from './create-order/create-order.component';
import { ListOrderComponent } from './list-order/list-order.component';
import { UpdateOrderComponent } from './update-order/update-order.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'create-order',
                component: CreateOrderComponent,
                canActivate: [AdminGuard, SellerGuard],
            },
            {
                path: 'list-order',
                component: ListOrderComponent,
                canActivate: [AdminGuard, SellerGuard, StorekeeperGuard, DispatcherGuard],
            },
            {
                path: 'update-order/:id',
                component: UpdateOrderComponent,
                canActivate: [AdminGuard],
            }
        ]   
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class OrderRoutingModule { }