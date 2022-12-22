import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RecipeListComponentState } from './recipe-list.component.state';

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
		private readonly activatedRoute: ActivatedRoute,
		private readonly router: Router,
		private readonly componentState: RecipeListComponentState
	) { }

	ngOnInit(): void {

		this.subscription.add(
			this.activatedRoute.queryParams.subscribe({
				next: (params => {
					let { page, size } = params;
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

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

}
