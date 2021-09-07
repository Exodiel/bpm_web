import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../shared/guard/admin.guard';
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
        canActivate: [AdminGuard],
      },
      {
        path: 'list-client',
        component: ListClientComponent,
        canActivate: [AdminGuard],
      },
      {
        path: 'update-client/:id',
        component: UpdateClientComponent,
        canActivate: [AdminGuard],
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ClientRoutingModule { }
