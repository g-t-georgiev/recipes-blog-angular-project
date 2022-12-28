import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { ILocalState, SignInComponentState } from './sign-in.component.state';
import { IUserSignInDto } from '../../../core/services/auth.service';


@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.css'],
	providers: [SignInComponentState]
})
export class SignInComponent implements OnDestroy {

	private subscription!: Subscription;
	readonly localState$: Observable<ILocalState> = this.componentState.localState$;

	constructor(
		private readonly componentState: SignInComponentState
	) { }

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	submitHandler(formModel: NgForm) {

		if (formModel.invalid) {
			return;
		}

		// console.log(formModel);
		const userData: IUserSignInDto = formModel.form.value;
		this.componentState.onLoginEventEffect(userData);
	}

}
