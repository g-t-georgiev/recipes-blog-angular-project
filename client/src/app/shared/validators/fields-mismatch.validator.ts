import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

function mismatchErrorFactory(targetControlValue: any, currentControlValue: any): ValidationErrors | null {
    return targetControlValue !== currentControlValue
    ? { mismatch: { target: targetControlValue, current: currentControlValue } }
    : null;
}

export function fieldsMismatchValidator(targetControl: AbstractControl): ValidatorFn {
    
    return function (currentControl: AbstractControl): ValidationErrors | null {

        if (targetControl && targetControl?.value == null) {
            return null;
        }

        if (currentControl && currentControl?.value == null) {
            return null;
        }

        return mismatchErrorFactory(targetControl.value, currentControl.value);
    }
}