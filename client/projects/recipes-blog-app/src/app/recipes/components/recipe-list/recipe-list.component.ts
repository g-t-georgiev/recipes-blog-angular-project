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
	readonly pageOptionsData$ = this.componentStore.pageOptionsData$;

	constructor(
		private readonly componentStore: RecipesStore, 
	) {
		this.titleInputChangeHandler = debounce(this.titleInputChangeHandler, 700);
	}

	ngOnInit(): void {
		this.subscription.add(
			this.componentStore.fetchRecipes(this.pageOptionsData$)
		);
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	limitSelectChangeHandler(value: any, state: RecipesState) {

		if (value == null) return;

		value = parseInt(value, 10);

		if (isNaN(value)) return;

		if (value === state.pageOptions.pageEntriesLimit) return;

		this.componentStore.navigate({
			payload: {
				relativeToCurrentRoute: true,
				path: [],
				query: {
					page: 1,
					limit: value,
					...(
						state.pageOptions.pageQueryFilter.title 
						? { ...state.pageOptions.pageQueryFilter, title: state.pageOptions.pageQueryFilter.title } 
						: { ...state.pageOptions.pageQueryFilter }
					)
				},
				extras: {
					preserveFragment: true
				}
			}
		});
	}

	titleInputChangeHandler(value: string, state: RecipesState) {

		if (
			value == null || 
			value === state.pageOptions.pageQueryFilter?.title
		) {
			return;
		}

		value = value.trim();
		const filters = { ...(value ? { title: value } : {}) };
		// console.log(filters);

		this.componentStore.navigate({
			payload: {
				relativeToCurrentRoute: true,
				path: [],
				query: {
					page: 1,
					limit: state.pageOptions.pageEntriesLimit,
					...filters
				},
				extras: {
					preserveFragment: true, 
				}
			}
		});
	}

	toggleClickedPage(pageIndex: number, pageEntriesLimit: number, pageQueryFilter: any = {}) {

		this.componentStore.navigate({
			payload: {
				relativeToCurrentRoute: true,
				path: [],
				query: {
					page: pageIndex,
					limit: pageEntriesLimit,
					...(pageQueryFilter.title ? { ...pageQueryFilter, title: pageQueryFilter.title } : { ...pageQueryFilter })
				},
				extras: {
					preserveFragment: true, 
				}
			}
		});
	}

	togglePreviousPage(pageIndex: number, pageEntriesLimit: number, pageQueryFilter: any = {}) {

		if (pageIndex < 1) {
			return;
		}

		this.componentStore.navigate({
			payload: {
				relativeToCurrentRoute: true,
				path: [],
				query: {
					page: pageIndex,
					limit: pageEntriesLimit,
					...(pageQueryFilter.title ? { ...pageQueryFilter, title: pageQueryFilter.title } : { ...pageQueryFilter })
				},
				extras: {
					preserveFragment: true, 
				}
			}
		});
	}

	toggleNextPage(pageIndex: number, pageEntriesLimit: number, pageQueryFilter: any = {}, totalPagesCount: number ) {

		if (pageIndex > totalPagesCount) {
			return;
		}

		this.componentStore.navigate({
			payload: {
				relativeToCurrentRoute: true,
				path: [],
				query: {
					page: pageIndex,
					limit: pageEntriesLimit,
					...(pageQueryFilter.title ? { ...pageQueryFilter, title: pageQueryFilter.title } : { ...pageQueryFilter })
				},
				extras: {
					preserveFragment: true, 
				}
			}
		});
	}

}
