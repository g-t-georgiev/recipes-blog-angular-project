import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { IUser } from 'projects/recipes-blog-app/src/app/shared/interfaces';
import { environment } from '../../../environments/environment';


interface ProfileDetailsApiResponse {
	user?: IUser,
	message: string;
}

export interface EditProfileDto {
	username: string;
	email: string;
	profilePicture?: File
}

@Injectable()
export class UsersService {

	constructor(
		private readonly http: HttpClient
	) { }

	duplicateCredentialsCheck(credentials: string): Observable<boolean> {
		const httpParams = { credentials };
		const httpOptions = { params: httpParams };
		return this.http.get<boolean>(`${environment.apiUrl}/users/check`, httpOptions);
	}

	loadProfileDetails() {
		return this.http.get<ProfileDetailsApiResponse>(`${environment.apiUrl}/users/profile`);
	}

	editProfile(userData: EditProfileDto): Observable<ProfileDetailsApiResponse> {

		const formData = new FormData();
		formData.set('username', userData.username);
		formData.set('email', userData.email);

		if (userData.profilePicture) {
			formData.append('profilePicture', userData.profilePicture);
		}

		return this.http.put<ProfileDetailsApiResponse>(`${environment.apiUrl}/users/profile`, formData);
	}

}
