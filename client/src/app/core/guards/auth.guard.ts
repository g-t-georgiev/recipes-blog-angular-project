import { Injectable } from '@angular/core';

import { 
	ActivatedRouteSnapshot, 
	CanActivate, 
	Router, 
	RouterStateSnapshot, 
	UrlTree 
} from '@angular/router';

import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { AuthService } from '../services';

@Injectable()
export class AuthGuard implements CanActivate {

	constructor(
		private readonly authService: AuthService,
		private readonly router: Router
	) { }

	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot): Observable<boolean | UrlTree> {

		return this.authService.isLoggedIn$.pipe(
			map((isLoggedIn) => {

				if (isLoggedIn) {
					return true;
				}

				const routerOptions = {
					queryParams: {
						redirectTo: state.url
					}
				};

				return this.router.createUrlTree(['/users', 'login'], routerOptions);
			})
		);
	}

}
