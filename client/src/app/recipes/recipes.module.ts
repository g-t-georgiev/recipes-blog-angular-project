import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeListComponent } from './components';
import { AddRecipeComponent } from './components/add-recipe/add-recipe.component';


@NgModule({
	declarations: [
    	RecipeListComponent,
     	AddRecipeComponent
  ],
	imports: [
		CommonModule,
		RecipesRoutingModule
	],
	exports: [
		RecipeListComponent,
		AddRecipeComponent
	]
})
export class RecipesModule { }
