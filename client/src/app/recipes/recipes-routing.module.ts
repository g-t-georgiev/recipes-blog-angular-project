import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipeListComponent } from './components';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RecipeListComponent
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
export class RecipesRoutingModule { }