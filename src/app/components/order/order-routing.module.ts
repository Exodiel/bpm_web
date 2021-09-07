import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../shared/guard/admin.guard';
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
                canActivate: [AdminGuard],
            },
            {
                path: 'list-order',
                component: ListOrderComponent,
                canActivate: [AdminGuard],
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