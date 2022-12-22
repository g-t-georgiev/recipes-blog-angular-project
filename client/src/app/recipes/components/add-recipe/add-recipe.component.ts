import { Component, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

import { AddRecipeComponentState, ILocalState } from './add-recipe.component.state';

@Component({
	selector: 'app-add-recipe',
	templateUrl: './add-recipe.component.html',
	styleUrls: ['./add-recipe.component.css'],
	providers: [AddRecipeComponentState]
})
export class AddRecipeComponent implements OnDestroy {

	private subscription!: Subscription;

	readonly localState$: Observable<ILocalState> = this.componentState.localState$;

	constructor(
		private readonly componentState: AddRecipeComponentState
	) { }

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	submitHandler(formModel: NgForm) {

		if (formModel.invalid) {
			return;
		}

		// console.log(formModel);
		const { title, content } = formModel.form.value;
		this.subscription = this.componentState.sendCreateRecipeRequestEffect({ title, content });
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
