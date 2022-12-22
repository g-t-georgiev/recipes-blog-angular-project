import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RecipesRoutingModule } from './recipes-routing.module';
import { RecipeListComponent } from './components';


@NgModule({
	declarations: [
    	RecipeListComponent
  ],
	imports: [
		CommonModule,
		RecipesRoutingModule
	],
	exports: [
		RecipeListComponent
	]
})
export class RecipesModule { }
