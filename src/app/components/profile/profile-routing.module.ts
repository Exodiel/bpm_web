import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserComponent } from './user/user.component';
import { AdminGuard } from '../../shared/guard/admin.guard';
import { SellerGuard } from '../../shared/guard/seller.guard';
import { StorekeeperGuard } from '../../shared/guard/storekeeper.guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'user',
        component: UserComponent,
        canActivate: [AdminGuard, SellerGuard, StorekeeperGuard]
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ProfileRoutingModule { }
