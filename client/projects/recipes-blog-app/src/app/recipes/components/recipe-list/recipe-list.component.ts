import { Component } from '@angular/core';

import { RecipesStore } from './recipe-list.store';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css'],
	providers: [RecipesStore]
})
export class RecipeListComponent {

	readonly localState$ = this.componentStore.state$;
	readonly pageQueryOptions$ = this.componentStore.pageQueryParams$;

	constructor(
		private readonly componentStore: RecipesStore, 
	) { }

	onPageChange(data: any) {
		// console.log(data);

		this.componentStore.navigate({
			payload: {
				relativeToCurrentRoute: true,
				path: [],
				query: {
					page: data.pageIndex,
					limit: data.pageSize
				},
				extras: {
					preserveFragment: true, 
				}
			}
		});

	}

}
