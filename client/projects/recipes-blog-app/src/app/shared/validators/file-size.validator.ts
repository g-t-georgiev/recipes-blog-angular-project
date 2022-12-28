import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

function converToBytes(value: number): number {
    if (value < 0) {
        throw new Error('Value cannot be negative');
    }

    return value * 1024 * 1024;
}

/**
 * Accepts file size limit and return a validator function
 * @param limit File size in megabytes
 */
export function maxSizeValidator(limit: number): ValidatorFn {
    return function (control: AbstractControl): ValidationErrors | null {
        if (!control.value) {
            return null;
        }

        limit = converToBytes(limit);
        return control.value.size > limit ? { maxsize: true } : null;
    }
}