import { AfterViewInit, Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { debounceTime, distinctUntilChanged, Subject, Subscription, switchMap, takeUntil, tap } from 'rxjs';

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

	@ViewChild('filterByTitleInput') filterByTitleInput!: NgForm;

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly router: Router,
		private readonly componentState: RecipeListComponentState
	) { }

	ngOnInit(): void {

		this.subscription.add(
			this.activatedRoute.queryParams.subscribe({
				next: (params => {

					let { page, size, title } = params;
					let updatedQueryParams;

					if (!page || isNaN(+page) || +page < 1) {
						updatedQueryParams = {
							...params,
							page: 1
						}
					}

					if (!size || isNaN(+size) || +size < 1) {
						updatedQueryParams = {
							...params,
							size: 10
						}
					}

					if (updatedQueryParams) {
						const updatedUrlTree = this.router.createUrlTree([], {
							queryParams: updatedQueryParams,
							relativeTo: this.activatedRoute
						});

						this.router.navigateByUrl(updatedUrlTree);
						return;
					}

					
					this.componentState.queryParamsChangeEffect(params);
				})
			})
		);

	}

	ngAfterViewInit(): void {

		this.filterByTitleInput.valueChanges?.pipe(
			debounceTime(500),
			distinctUntilChanged(), 
			tap((title) => {

				title = title?.trim();
				console.log(title);

				if (title != null) {
					let queryParams = title.length ? { title } : null;

					const updatedUrlTree = this.router.createUrlTree([], {
						queryParams,
						relativeTo: this.activatedRoute
					});
	
					this.router.navigateByUrl(updatedUrlTree);
				}

			})
		).subscribe();

	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

}
