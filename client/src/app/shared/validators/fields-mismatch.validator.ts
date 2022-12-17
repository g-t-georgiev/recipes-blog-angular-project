import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

export function fieldsMismatchValidator(targetControl: AbstractControl): ValidatorFn {
    
    return function (dispatchControl: AbstractControl): ValidationErrors | null {

        if (targetControl && targetControl?.value == null) {
            return null;
        }

        if (dispatchControl && dispatchControl?.value == null) {
            return null;
        }

        return (
            targetControl.value !== dispatchControl.value 
            ? { fieldValuesMismatch: { targetControlValue: targetControl.value, dispatchControlValue: dispatchControl.value } } 
            : null
        );
    }
}