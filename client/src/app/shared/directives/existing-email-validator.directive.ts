import { HttpClient } from '@angular/common/http';
import { Directive, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

import { environment } from 'src/environments/environment';


@Directive({
	selector: '[emailExists]',
	providers: [
		{
			provide: NG_ASYNC_VALIDATORS,
			useExisting: forwardRef(() => ExistingEmailValidatorDirective),
			multi: true
		}
	]
})
export class ExistingEmailValidatorDirective implements AsyncValidator {

	constructor(
		private readonly http: HttpClient
	) { }

	validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {
		return this.http.get<{ message: string }>(environment.apiUrl + '/users/auth/email', { params: { email: control.value } })
			.pipe(
				map(({ message }) => {
					console.log(message);
					return null;
				}),
				catchError((error) => {
					console.log(error);
					return of({ emailExists: true });
				})
			);
	}

}
