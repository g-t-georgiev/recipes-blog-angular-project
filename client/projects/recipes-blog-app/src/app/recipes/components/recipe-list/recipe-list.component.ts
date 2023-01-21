import { Component, AfterViewInit, OnDestroy } from '@angular/core';

import { Subject, Subscription } from 'rxjs';
import { skip, tap } from 'rxjs/operators';

import { RecipesStore } from './recipe-list.store';

@Component({
	selector: 'app-recipe-list',
	templateUrl: './recipe-list.component.html',
	styleUrls: ['./recipe-list.component.css'],
	providers: [RecipesStore]
})
export class RecipeListComponent implements AfterViewInit, OnDestroy {

	private readonly subscription = new Subscription();

	readonly localState$ = this.componentStore.state$;
	readonly pageQueryOptions$ = this.componentStore.pageQueryParams$;

	private readonly page$: Subject<any> = new Subject();

	constructor(
		private readonly componentStore: RecipesStore, 
	) { }

	ngAfterViewInit(): void {
		this.subscription.add(
			this.page$.pipe(
				skip(1),
				tap((data) => {
					console.log(data);

					this.componentStore.navigate({
						payload: {
							relativeToCurrentRoute: true,
							path: [],
							query: {
								page: data.pageIndex,
								size: data.pageSize
							},
							extras: {
								preserveFragment: true, 
							}
						}
					});
				})
			).subscribe()
		);
	}

	ngOnDestroy(): void {
		this.subscription.unsubscribe();
	}

	onPageChange(ev: any) {
		this.page$.next(ev);
	}

}
