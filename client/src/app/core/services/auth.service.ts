import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IRootState } from 'src/app/+state';
import { login, logout } from 'src/app/+state/current-user/current-user.actions';
import { IUser } from 'src/app/shared/interfaces';
import { environment } from 'src/environments/environment';

const { apiUrl } = environment;
const signInUrl = `${apiUrl}/login`;
const signUpUrl = `${apiUrl}/register`;
const signOutUrl = `${apiUrl}/logout`;
const authUrl = `${apiUrl}/users/auth`;

interface IUserSignInDto {
	username: string;
	password: string;
}

interface IUserSignUpDto {
	email: string;
	username: string;
	imageUrl: string;
	password: string;
	repeatPassword: string;
}

interface IUserSignInResponse {
	user?: IUser;
	message: string;
}

interface IUserSignUpResponse {
	message: string;
}

interface IUserSignOutResponse {
	message: string;
}

@Injectable()
export class AuthService {

	currentUser$: Observable<IUser | null> = this.state.select((globalState) => globalState.currentUser);
	isLoggedIn$: Observable<boolean> = this.currentUser$.pipe(map(user => Boolean(user)));

	constructor(
		private http: HttpClient,
		private state: Store<IRootState>
	) { }

	login$(userData: IUserSignInDto): Observable<IUserSignInResponse> {
		return this.http.post<IUserSignInResponse>(signInUrl, userData, { withCredentials: true });
	}

	register$(userData: IUserSignUpDto): Observable<IUserSignUpResponse> {
		return this.http.post<IUserSignUpResponse>(signUpUrl, userData, { withCredentials: true });
	}

	logout$(): Observable<IUserSignOutResponse> {
		return this.http.delete<IUserSignOutResponse>(signOutUrl, { withCredentials: true });
	}

	authenticate$(): Observable<IUserSignInResponse> {
		return this.http.get<IUserSignInResponse>(authUrl)
			.pipe(
				tap(({ user }) => {
					if (user) {
						this.loginHandler(user);
					}
				}),
				catchError((error) => {
					// console.error(error);
					return EMPTY;
				})
			);
	}

	loginHandler(newUser: IUser): void {
		this.state.dispatch(login({ user: newUser }));
	}

	logoutHandler() {
		this.state.dispatch(logout());
	}

}
