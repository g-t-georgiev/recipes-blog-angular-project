import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

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

}
