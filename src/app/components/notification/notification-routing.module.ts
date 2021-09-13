import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '../../shared/guard/admin.guard';
import { SellerGuard } from '../../shared/guard/seller.guard';
import { StorekeeperGuard } from '../../shared/guard/storekeeper.guard';
import { DispatcherGuard } from '../../shared/guard/dispatcher.guard';
import { ListNotificationComponent } from './list-notification/list-notification.component';

const routes: Routes = [
    {
        path: '',
        children: [
            {
                path: 'list-notification',
                component: ListNotificationComponent,
                canActivate: [AdminGuard, SellerGuard, StorekeeperGuard, DispatcherGuard],
            },
        ]
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class NotificationRoutingModule { }