import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

/**
 * Accepts file size limit and return a validator function
 * @param limit File size in megabytes
 */
export function maxSizeValidator(limit: number): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }

        return control.value.size > limit ? { maxsize: true } : null;
    }
}