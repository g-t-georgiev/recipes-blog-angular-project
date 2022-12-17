import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';

import { maxlengthValidator } from '../validators';

@Directive({
	selector: '[customMaxlength]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => MaxlengthValidatorDirective),
			multi: true
		}
	]
})
export class MaxlengthValidatorDirective implements Validator {

	@Input('customMaxlength') _maxlength!: string;

	private get maxlength(): number {
		return parseInt(this._maxlength, 10);
	}

	constructor() { }

	validate(control: AbstractControl<any, any>): ValidationErrors | null {
		return maxlengthValidator(this.maxlength)(control);
	}

}
