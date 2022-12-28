import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '../core/guards';
import { ProfileDetailsComponent } from './components/profile-details/profile-details.component';

import { ProfileComponent } from './components/profile/profile.component';

const routes: Routes = [
    {
        path: '',
        canActivate: [AuthGuard],
        component: ProfileComponent,
        title: 'Profile',
        children: [
            {
                path: ':id',
                component: ProfileDetailsComponent,
                title: 'Profile Details'
            }
        ]
    },

];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class UsersRoutingModule { }