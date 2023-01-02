import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { EMPTY, Observable } from 'rxjs';
import { catchError, map, tap } from 'rxjs/operators';

import { IRootState, currentUser as currentUserStore } from 'projects/recipes-blog-app/src/app/+store';
import { IUser } from 'projects/recipes-blog-app/src/app/shared/interfaces';
import { environment } from 'projects/recipes-blog-app/src/environments/environment';

const { apiUrl } = environment;
const signInUrl = `${apiUrl}/login`;
const signUpUrl = `${apiUrl}/register`;
const signOutUrl = `${apiUrl}/logout`;
const authUrl = `${apiUrl}/users/profile`;

export interface IUserSignInDto {
	username: string;
	password: string;
}

export interface IUserSignUpDto {
	email: string;
	username: string;
	profilePicture?: string;
	password: string;
	repeatPassword: string;
}

export interface IUserSignInResponse {
	user?: IUser;
	message: string;
}

export interface IUserSignUpResponse {
	message: string;
}

export interface IUserSignOutResponse {
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
		return this.http.post<IUserSignInResponse>(signInUrl, userData);
	}

	register$(userData: IUserSignUpDto): Observable<IUserSignUpResponse> {
		const formData = new FormData();
		formData.set('email', userData.email);
		formData.set('username', userData.username);
		formData.set('password', userData.password);
		formData.set('repeatPassword', userData.repeatPassword);

		if (userData.profilePicture) {
			formData.append('profilePicture', userData.profilePicture);
		}

		return this.http.post<IUserSignUpResponse>(signUpUrl, formData);
	}

	logout$(): Observable<IUserSignOutResponse> {
		return this.http.delete<IUserSignOutResponse>(signOutUrl);
	}

	authenticate$(): Observable<IUserSignInResponse> {
		// console.log('AuthService#authenticate$');
		return this.http.get<IUserSignInResponse>(authUrl)
			.pipe(
				tap(({ user: currentUser }) => {
					if (currentUser) {
						this.loginHandler(currentUser);
					}
				}),
				catchError((error) => {

					// console.log(error);
					let errorMsg;

					if (error.status === 0) {
						errorMsg = 'Connection error';
					} else {
						errorMsg = error.error?.message ?? error?.message ?? error?.statusText ?? 'Something went wrong';
					}
					
					// console.log(errorMsg);
					return EMPTY;
				})
			);
	}

	loginHandler(newUser: IUser): void {
		this.state.dispatch(currentUserStore.actions.login({ user: newUser }));
	}

	logoutHandler() {
		this.state.dispatch(currentUserStore.actions.logout());
	}

}
