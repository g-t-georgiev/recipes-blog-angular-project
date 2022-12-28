import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { debounceTime, distinctUntilChanged, Subscription, tap } from 'rxjs';

import { RecipeListComponentState } from './recipe-list.component.state';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css'],
	providers: [RecipeListComponentState]
})
export class RecipeListComponent implements OnInit, AfterViewInit, OnDestroy {

	private readonly subscription = new Subscription();

	readonly localState$ = this.componentState.localState$;

	@ViewChild('filterResultsForm') filterResultsForm!: NgForm;

	constructor(
		private readonly componentState: RecipeListComponentState
	) { }

	ngOnInit(): void {
		this.subscription.add(
			this.componentState.initializerEffect()
		);
	}

	ngAfterViewInit(): void {

	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	getTotalPagesCount(entriesPerPageCount: number, totalEntriesCount: number) {
		return Math.ceil(totalEntriesCount / entriesPerPageCount);
	}

	toggleClickedPage(page: number) {
		console.log(page);
		// TODO: Integrate with component state
	}

	togglePreviousPage(prevPage: number) {

		if (prevPage <= 1) {
			return;
		}

		console.log(prevPage);
		// TODO: Integrate with component state
	}

	toggleNextPage(nextPage: number, totalPagesCount: number ) {

		if (nextPage >= totalPagesCount) {
			return;
		}

		console.log(nextPage);
		// TODO: Integrate with component state
	}

}
