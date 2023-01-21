import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { AuthGuard, PaginationGuard } from '../core/guards';

import { RecipeListComponent } from './components';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';


const routes: Routes = [
    {
        path: '',
        pathMatch: 'full', 
        title: 'Recipes', 
        canActivate: [PaginationGuard], 
        data: {
            forwardTo: 'recipes'
        },
        component: RecipeListComponent
    },
    {
        path: 'add', 
        title: 'Create recipe', 
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