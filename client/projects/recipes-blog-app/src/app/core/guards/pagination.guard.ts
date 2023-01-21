import { Injectable } from '@angular/core';
import { CanActivate, Router, UrlTree } from '@angular/router';
import { Store } from '@ngrx/store';
import { Observable, map } from 'rxjs';

import { getMergedRouteState } from '../../+router-store';


@Injectable()
export class PaginationGuard implements CanActivate {

	private readonly router$ = this.store.select(getMergedRouteState);

	constructor(
		private readonly store: Store,
		private readonly router: Router
	) { }

	canActivate(): Observable<boolean | UrlTree> {

		return this.router$.pipe(
			map(r => {
				
				const { 
					queryParams: { page, size }, 
					data: { forwardTo } 
				} = r;

				if (!page || !size) {
					return this.router.createUrlTree(['/', forwardTo], { queryParams: { page: 1, size: 10 } });
				}

				return true;
			})
		);

	}

}
