import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { passwordsMatchValidator } from '../validators';


@Directive({
	selector: '[passwordsMatch]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => PasswordsMatchValidatorDirective),
			multi: true
		}
	]
})
export class PasswordsMatchValidatorDirective implements Validator {

	validate(formGroup: AbstractControl<any, any>): ValidationErrors | null {
		return passwordsMatchValidator(formGroup);
	}

}
