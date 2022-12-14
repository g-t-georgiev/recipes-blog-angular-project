import { Directive, forwardRef } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { CustomValidatorsService } from '../services';
// import { passwordsMatchValidator } from '../validators';


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

	constructor(
		private readonly customValidators: CustomValidatorsService
	) { }

	validate(formGroup: AbstractControl<any, any>): ValidationErrors | null {
		return this.customValidators.passwordsMatchValidator(formGroup);
	}

}
