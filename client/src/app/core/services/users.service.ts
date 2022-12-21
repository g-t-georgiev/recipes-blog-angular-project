import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { IUser } from 'src/app/shared/interfaces';
import { environment } from '../../../environments/environment';


interface ProfileDetailsApiResponse {
	user?: IUser,
	message: string;
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

}
