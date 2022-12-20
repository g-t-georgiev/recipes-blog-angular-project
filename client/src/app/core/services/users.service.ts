import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, EMPTY } from 'rxjs';
import { catchError } from 'rxjs/operators';

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
