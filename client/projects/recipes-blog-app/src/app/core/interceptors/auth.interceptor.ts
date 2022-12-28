import { Injectable } from '@angular/core';
import {
	HttpRequest,
	HttpHandler,
	HttpEvent,
	HttpInterceptor,
	HttpResponse
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';

import { AuthService, IUserSignInResponse } from '../services/auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

	constructor(
		private authService: AuthService
	) { }

	intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
		return next.handle(request)
			.pipe(
				tap(event => {

					if (event instanceof HttpResponse) {
						
						if (event.url?.endsWith('login')) {
							const { user } = event.body as IUserSignInResponse

							if (!user) return;

							this.authService.loginHandler(user);
						}

						if (event.url?.endsWith('logout')) {
							this.authService.logoutHandler();
						}

					}

				})
			);
	}
}
