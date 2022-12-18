import { AbstractControl, ValidationErrors } from "@angular/forms";

function errorFactory(...controls: Readonly<AbstractControl[]>): ValidationErrors | null {
    let firstChange = true;
    let previousValue: any = null;

    for (const { value: currentValue } of controls) {
        console.log(firstChange)
        if (firstChange) {
            previousValue = currentValue;
            firstChange = false;
            continue;
        }

        if (currentValue !== previousValue) {
            return { mismatch: true };
        }
        
    }
    
    return null;
}

export function passwordsMatchValidator(formGroup: AbstractControl): ValidationErrors | null {

    const passwordControl = formGroup.get('password');
    const confirmPasswordControl = formGroup.get('repeatPassword');

    if (passwordControl == null || passwordControl.value == null) {
        return null;
    }

    if (confirmPasswordControl == null || confirmPasswordControl.value == null) {
        return null;
    }

    return errorFactory(passwordControl, confirmPasswordControl);
}