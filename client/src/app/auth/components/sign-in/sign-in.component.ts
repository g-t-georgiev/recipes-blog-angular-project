import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { tap } from 'rxjs';

import { ILocalState, SignInComponentState } from './sign-in.component.state';
import { AuthService, IUserSignInDto } from '../../../core/services/auth.service';


@Component({
	selector: 'app-sign-in',
	templateUrl: './sign-in.component.html',
	styleUrls: ['./sign-in.component.css'],
	providers: [SignInComponentState]
})
export class SignInComponent {

	readonly localState$: Observable<ILocalState> = this.componentState.localState$;

	constructor(
		private readonly componentState: SignInComponentState, 
		private readonly authService: AuthService,
		private readonly router: Router
	) { }

	submitHandler(formModel: NgForm) {

		if (formModel.invalid) {
			return;
		}

		console.log(formModel);
		const userData: IUserSignInDto = formModel.form.value;

		this.authService.login$(userData).pipe(
			tap(() => {
				this.componentState.updateProcessingState(true);
			})
		).subscribe({
			next: ({ message }) => {
				console.log(message);

				this.componentState.updateMessageState(message);
				this.componentState.updateProcessingState(false);
				setTimeout(() => {
					this.router.navigate(['/']);
				}, 2e3);
			},
			complete: () => {
				console.log('Login completed');
			},
			error: ({ error }) => {
				console.log(error);
				this.componentState.updateMessageState(error?.message ?? 'Something went wrong');
				this.componentState.updateProcessingState(false);
			}
		});
	}

}
