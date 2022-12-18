import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { IUserSignUpDto } from 'src/app/core/services';
import { SignUpComponentState, ILocalState } from './sign-up.component.state';

@Component({
	selector: 'app-sign-up',
	templateUrl: './sign-up.component.html',
	styleUrls: ['./sign-up.component.css'],
	providers: [SignUpComponentState]
})
export class SignUpComponent implements OnDestroy {

	private subscription!: Subscription;
	readonly localState$: Observable<ILocalState> = this.componentState.localState$;

	constructor(
		private readonly componentState: SignUpComponentState
	) { }

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	submitHandler(formModel: NgForm) {

		if (formModel.invalid) {
			return;
		}

		// console.log(formModel);
		const { email, username, profilePicture, passwords: { password, repeatPassword } } = formModel.form.value;
		const userData: IUserSignUpDto = { email, username, profilePicture, password, repeatPassword };
		// console.log(userData);
		this.componentState.onRegisterEventEffect(userData);
	}

	hasEmptyFields(formModel: NgForm) {
	
		for (let controlName in formModel.controls) {
			const formControl = formModel.controls[controlName];
			const hasRequiredError = Boolean(formControl.errors?.['required']);

			if (hasRequiredError) {
				return hasRequiredError;
			}
		}

		return false;
	}

}
