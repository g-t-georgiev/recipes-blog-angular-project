import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards';

import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        canActivate: [AuthGuard],
        component: ProfileComponent,
        title: 'Profile'
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }