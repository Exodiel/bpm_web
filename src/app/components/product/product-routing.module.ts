import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../shared/guard/admin.guard';
import { SellerGuard } from '../../shared/guard/seller.guard';
import { StorekeeperGuard } from '../../shared/guard/storekeeper.guard';
import { CreateProductComponent } from './create-product/create-product.component';
import { ListProductComponent } from './list-product/list-product.component';
import { UpdateProductComponent } from './update-product/update-product.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list-product',
                component: ListProductComponent,
                canActivate: [AdminGuard, SellerGuard, StorekeeperGuard],
            },
            {
                path: 'create-product',
                component: CreateProductComponent,
                canActivate: [AdminGuard, SellerGuard, StorekeeperGuard],
            },
            {
                path: 'update-product/:id',
                component: UpdateProductComponent,
                canActivate: [AdminGuard, SellerGuard, StorekeeperGuard],
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ProductRoutingModule {}