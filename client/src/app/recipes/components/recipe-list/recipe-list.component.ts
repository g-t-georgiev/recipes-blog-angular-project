import { Component } from '@angular/core';
import { RecipeListComponentState } from './recipe-list.component.state';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css'],
	providers: [RecipeListComponentState]
})
export class RecipeListComponent {

}
