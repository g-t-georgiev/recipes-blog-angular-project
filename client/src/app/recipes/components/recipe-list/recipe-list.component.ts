import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { tap } from 'rxjs/operators';

import { RecipeListComponentState } from './recipe-list.component.state';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css'],
	providers: [RecipeListComponentState]
})
export class RecipeListComponent implements OnInit, OnDestroy {

	private readonly subscription = new Subscription();

	constructor(
		private readonly activatedRoute: ActivatedRoute,
		private readonly router: Router,
		private readonly componentState: RecipeListComponentState
	) { }

	ngOnInit(): void {
		this.subscription.add(
			this.activatedRoute.queryParamMap.pipe(
				tap((paramMap) => {
					const page = paramMap.get('page');
					const size = paramMap.get('size');

					let updatedUrlQueries;

					if (!page || isNaN(+page) || +page < 1) {

						updatedUrlQueries = {
							...(this.activatedRoute.snapshot.queryParams),
							...updatedUrlQueries ?? {},
							page: 1
						};

					}

					if (!size || isNaN(+size) || +size < 1) {
						updatedUrlQueries = {
							...(this.activatedRoute.snapshot.queryParams),
							...updatedUrlQueries ?? {},
							size: 10
						};

					}

					if (updatedUrlQueries) {
						const urlTree = this.router.createUrlTree([], {
							queryParams: updatedUrlQueries,
							relativeTo: this.activatedRoute
						});

						this.router.navigateByUrl(urlTree);
					}
				})
			).subscribe()
		);

		this.subscription.add(
			this.componentState.queryParamsChangeEffect(
				this.activatedRoute.queryParams
			)
		);
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

}
