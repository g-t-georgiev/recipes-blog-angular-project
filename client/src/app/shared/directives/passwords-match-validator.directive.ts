import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { fieldsMismatchValidator } from '../validators';


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

	@Input('passwordsMatch') targetControl!: AbstractControl;

	constructor() { }

	validate(dispatchControl: AbstractControl<any, any>): ValidationErrors | null {
		return fieldsMismatchValidator(this.targetControl)(dispatchControl);
	}

}
