import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { RecipesState, RecipesStore } from './recipe-list.store';
import { debounce } from 'projects/recipes-blog-app/src/assets/utils/debounce';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css'],
	providers: [RecipesStore]
})
export class RecipeListComponent implements OnInit, OnDestroy {

	private readonly subscription = new Subscription();

	readonly localState$ = this.componentStore.state$;
	readonly pageQueryParams$ = this.componentStore.pageQueryParams$;

	constructor(
		private readonly componentStore: RecipesStore, 
	) { }

	ngOnInit(): void {

	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	log(obj: any) {
		console.log(obj);
		this.componentStore.navigate({
			payload: {
				relativeToCurrentRoute: true,
				path: [],
				query: {
					page: obj?.pageIndex ?? 1,
					limit: obj?.pageSize ?? 3
				},
				extras: {
					preserveFragment: true, 
				}
			}
		});
	}

}
