import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CreateUserComponent } from './create-user/create-user.component';
import { ListUserComponent } from './list-user/list-user.component';
import { UpdateUserComponent } from './update-user/update-user.component';
import { AdminGuard } from '../../shared/guard/admin.guard';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'create-user',
                component: CreateUserComponent,
                canActivate: [AdminGuard],
            },
            {
                path: 'list-user',
                component: ListUserComponent,
                canActivate: [AdminGuard],
            },
            {
                path: 'update-user/:id',
                component: UpdateUserComponent,
                canActivate: [AdminGuard],
            }
        ]   
    }
]

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }