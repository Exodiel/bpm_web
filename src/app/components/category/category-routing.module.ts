import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../shared/guard/admin.guard';
import { SellerGuard } from '../../shared/guard/seller.guard';
import { StorekeeperGuard } from '../../shared/guard/storekeeper.guard';
import { CreateCategoryComponent } from './create-category/create-category.component';

import { ListCategoryComponent } from './list-category/list-category.component'
import { UpdateCategoryComponent } from './update-category/update-category.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list-category',
                component: ListCategoryComponent,
                canActivate: [AdminGuard, SellerGuard, StorekeeperGuard],
            },
            {
                path: 'create-category',
                component: CreateCategoryComponent,
                canActivate: [AdminGuard, SellerGuard, StorekeeperGuard],
            },
            {
                path: 'update-category/:id',
                component: UpdateCategoryComponent,
                canActivate: [AdminGuard, SellerGuard, StorekeeperGuard],
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
  })
  export class CategoryRoutingModule { }