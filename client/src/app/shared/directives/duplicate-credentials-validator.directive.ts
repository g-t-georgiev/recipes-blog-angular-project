import { Directive, forwardRef } from '@angular/core';
import { NG_ASYNC_VALIDATORS, AsyncValidator, AbstractControl, ValidationErrors } from '@angular/forms';
import { Observable } from 'rxjs';

import { CustomValidatorsService } from '../services';


@Directive({
	selector: '[duplicateCredentialsCheck]',
	providers: [
		{
			provide: NG_ASYNC_VALIDATORS,
			useExisting: forwardRef(() => DuplicateCredentialsValidatorDirective),
			multi: true
		}
	]
})
export class DuplicateCredentialsValidatorDirective implements AsyncValidator {

	constructor(
		private readonly customValidators: CustomValidatorsService
	) { }

	validate(control: AbstractControl<any, any>): Observable<ValidationErrors | null> {

		return this.customValidators.duplicateCredentialsValidator(control);

		// return timer(700).pipe(
		// 		switchMap(() => this.usersService.duplicateCredentialsCheck(control.value)),
		// 		map(result => result ? { duplicateEmail: true } : null)
		// );
	}

}
