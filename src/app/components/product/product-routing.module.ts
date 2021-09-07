import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../shared/guard/admin.guard';
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
                canActivate: [AdminGuard],
            },
            {
                path: 'create-product',
                component: CreateProductComponent,
                canActivate: [AdminGuard],
            },
            {
                path: 'update-product/:id',
                component: UpdateProductComponent,
                canActivate: [AdminGuard],
            }
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
export class ProductRoutingModule {}