import { Directive, forwardRef, Input } from '@angular/core';
import { AbstractControl, NG_VALIDATORS, ValidationErrors, Validator } from '@angular/forms';
import { maxSizeValidator } from '../validators';

@Directive({
	selector: '[maxSize]',
	providers: [
		{
			provide: NG_VALIDATORS,
			useExisting: forwardRef(() => MaxSizeDirective),
			multi: true
		}
	]
})
export class MaxSizeDirective implements Validator {

	@Input('maxSize') limit: number = 5;

	constructor() { }

	validate(control: AbstractControl<any, any>): ValidationErrors | null {
		return maxSizeValidator(this.limit)(control);
	}

}
