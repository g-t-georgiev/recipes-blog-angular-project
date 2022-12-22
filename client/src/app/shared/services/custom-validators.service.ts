import { Inject, Injectable } from "@angular/core";
import { AbstractControl, ValidationErrors, ValidatorFn } from "@angular/forms";
import { Observable, timer } from "rxjs";
import { map, switchMap } from 'rxjs/operators';

import { UsersService } from "src/app/core/services";



@Injectable()
export class CustomValidatorsService {

    constructor(
        @Inject(UsersService) private readonly usersService: UsersService
    ) {}

    /**
     * Checks if the provided controls' values match 
     * returning password match valdation error or null otherwise.
     * @param controls 
     * @returns 
     */
    private passwordMatchErrorFactory(...controls: Readonly<AbstractControl[]>): ValidationErrors | null {
        let firstChange = true;
        let previousValue: any = null;
    
        for (const { value: currentValue } of controls) {
            // console.log(firstChange);
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

    /**
     * Receives a control group containing the child 
     * controls and checks if their values match.
     * @param formGroup 
     * @returns 
     */
    passwordsMatchValidator(formGroup: AbstractControl): ValidationErrors | null {

        const passwordControl = formGroup.get('password');
        const confirmPasswordControl = formGroup.get('repeatPassword');
    
        if (passwordControl == null || passwordControl.value == null) {
            return null;
        }
    
        if (confirmPasswordControl == null || confirmPasswordControl.value == null) {
            return null;
        }
    
        return this.passwordMatchErrorFactory(passwordControl, confirmPasswordControl);
    }

    /**
     * Checks if value is null or undefined or if it has property length.
     * @param value 
     * @returns 
     */
    private hasValidLength(value: any): boolean {
        return value != null && typeof value?.length === 'number';
    }

    /**
     * Maximum characters length validator
     * @param maxLength Character length limit
     * @returns 
     */
    maxlengthValidator(maxLength: number): ValidatorFn {
    
        return (control: AbstractControl): ValidationErrors | null => {
            return (
                this.hasValidLength(control.value) &&  
                control.value.length > maxLength 
                ? { maxlength: { requiredLength: maxLength, actualLength: control.value.length } } 
                : null
            );
        }
    }

    /**
     * Converts a megabytes to bytes
     * @param value Numeric value represented in MB
     * @returns 
     */
    private converToBytes(value: number): number {
        if (value < 0) {
            throw new Error('Value cannot be negative');
        }
    
        return value * 1024 * 1024;
    }
    
    /**
     * Accepts file size limit and return a validator function
     * @param limit File size in megabytes
     */
    maxSizeValidator(limit: number): ValidatorFn {
        return (control: AbstractControl): ValidationErrors | null => {
            if (!control.value) {
                return null;
            }
    
            limit = this.converToBytes(limit);
            return control.value.size > limit ? { maxsize: true } : null;
        }
    }

    /**
     * Sends a request to the API to check if the sent 
     * credentials match other registered user in the DB.
     * @param control 
     * @returns 
     */
    duplicateCredentialsValidator(control: AbstractControl): Observable<ValidationErrors | null> {

        return timer(700).pipe(
            switchMap(() => this.usersService.duplicateCredentialsCheck(control.value)),
            map(result => result ? { duplicate: true } : null)
        );
    }
    
}