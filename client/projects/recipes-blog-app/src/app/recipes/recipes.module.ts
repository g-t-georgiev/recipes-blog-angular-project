import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeListComponent, AddRecipeComponent } from './components';
import { FormsModule } from '@angular/forms';


@NgModule({
	declarations: [
    	RecipeListComponent,
     	AddRecipeComponent
  ],
	imports: [
		CommonModule,
		RecipesRoutingModule,
		FormsModule
	],
	exports: [
		RecipeListComponent,
		AddRecipeComponent
	]
})
export class RecipesModule { }
