import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ILocalState, RecipeListComponentState } from './recipe-list.component.state';
import { debounce } from 'projects/recipes-blog-app/src/assets/utils/debounce';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css'],
	providers: [RecipeListComponentState]
})
export class RecipeListComponent implements OnInit, OnDestroy {

	private readonly subscription = new Subscription();

	readonly localState$ = this.componentState.localState$;

	constructor(
		private readonly componentState: RecipeListComponentState
	) {
		this.titleInputChangeHandler = debounce(this.titleInputChangeHandler, 700);
	}

	ngOnInit(): void {
		this.subscription.add(
			this.componentState.initializerEffect()
		);
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	limitSelectChangeHandler(value: any, state: ILocalState) {

		// console.log(value);

		if (value == null) return;

		value = parseInt(value, 10);

		if (isNaN(value)) return;

		if (value === state.pageOptions.pageEntriesLimit) return;

		this.componentState.onFiltersChangeEffect({ pageEntriesLimit: value, pageQueryFilter: { ...state.pageOptions.pageQueryFilter } });
	}

	titleInputChangeHandler(value: string, state: ILocalState) {

		// console.log(value);

		if (value == null || value === state.pageOptions.pageQueryFilter?.title) {
			return;
		}

		value = value.trim();
		const filters = { ...(value ? { title: value } : {}) };
		// console.log(filters);
		this.componentState.onFiltersChangeEffect({ pageQueryFilter: filters }).unsubscribe();
	}

	getTotalPagesCount(entriesPerPageCount: number, totalEntriesCount: number) {
		return Math.ceil(totalEntriesCount / entriesPerPageCount);
	}

	toggleClickedPage(pageIndex: number, pageEntriesLimit: number, pageQueryFilter: any) {
		// console.log(pageIndex);
		this.componentState.onFiltersChangeEffect({ pageIndex, pageEntriesLimit, pageQueryFilter }).unsubscribe();
	}

	togglePreviousPage(pageIndex: number, pageEntriesLimit: number, pageQueryFilter: any) {

		if (pageIndex < 1) {
			return;
		}

		// console.log(pageIndex);
		this.componentState.onFiltersChangeEffect({ pageIndex, pageEntriesLimit, pageQueryFilter }).unsubscribe();
	}

	toggleNextPage(pageIndex: number, pageEntriesLimit: number, pageQueryFilter: any, totalPagesCount: number ) {

		if (pageIndex > totalPagesCount) {
			return;
		}

		// console.log(pageIndex);
		this.componentState.onFiltersChangeEffect({ pageIndex, pageEntriesLimit, pageQueryFilter }).unsubscribe();
	}

}
