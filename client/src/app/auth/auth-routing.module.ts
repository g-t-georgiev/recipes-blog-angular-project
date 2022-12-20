import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { SignInComponent, SignUpComponent } from './components';

const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        redirectTo: 'login'
    },
    {
        path: 'login',
        component: SignInComponent,
        title: 'Sign in'
    },
    {
        path: 'register',
        component: SignUpComponent,
        title: 'Sign up'
    },
    {
        path: 'profile',
        loadChildren: () => import('../users/users.module').then(m => m.UsersModule),
        title: 'Profile'
    }
];

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [
        RouterModule
    ]
})
export class AuthRoutingModule { }