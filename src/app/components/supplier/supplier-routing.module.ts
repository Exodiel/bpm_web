import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateSupplierComponent } from './create-supplier/create-supplier.component';
import { ListSupplierComponent } from './list-supplier/list-supplier.component';
import { UpdateSupplierComponent } from './update-supplier/update-supplier.component';
import { AdminGuard } from '../../shared/guard/admin.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'create-supplier',
        component: CreateSupplierComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'list-supplier',
        component: ListSupplierComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'update-supplier/:id',
        component: UpdateSupplierComponent,
        canActivate: [AdminGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class SupplierRoutingModule { }
