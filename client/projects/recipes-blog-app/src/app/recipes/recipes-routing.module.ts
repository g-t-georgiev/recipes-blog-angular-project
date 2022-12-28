import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard } from '../core/guards';

import { RecipeListComponent } from './components';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full',
        component: RecipeListComponent
    },
    {
        path: 'add', 
        canActivate: [AuthGuard],
        component: AddRecipeComponent
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