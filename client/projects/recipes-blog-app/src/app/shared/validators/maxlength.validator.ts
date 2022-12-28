import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";

function hasValidLength(value: any): boolean {
    return value != null && typeof value?.length === 'number';
}

export function maxlengthValidator(maxLength: number): ValidatorFn {
    
    return function (control: AbstractControl): ValidationErrors | null {
        return (
            hasValidLength(control.value) &&  
            control.value.length > maxLength 
            ? { maxlength: { requiredLength: maxLength, actualLength: control.value.length } } 
            : null
        );
    }
}