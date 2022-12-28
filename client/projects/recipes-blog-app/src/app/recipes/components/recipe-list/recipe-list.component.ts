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
	}

	togglePreviousPage(currentPage: number) {

		if (currentPage <= 1) {
			return;
		}

		console.log(currentPage - 1);

	}

	toggleNextPage(currentPage: number, entriesPerPageCount: number, totalEntriesCount: number) {

		let totalPagesCount = this.getTotalPagesCount(entriesPerPageCount, totalEntriesCount);

		if (currentPage >= totalPagesCount) {
			return;
		}

		console.log(currentPage + 1);

	}

}
