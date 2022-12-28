import { HttpClient } from '@angular/common/http';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { tap, withLatestFrom } from 'rxjs/operators';
import { EditProfileDto } from 'projects/recipes-blog-app/src/app/core/services';

import { ProfileDetailsState } from './profile-details.component.state';

@Component({
	selector: 'app-profile-details',
	templateUrl: './profile-details.component.html',
	styleUrls: ['./profile-details.component.css'],
	providers: [ProfileDetailsState]
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

	@ViewChild('editProfileForm') private editProfileForm!: NgForm;

	private readonly subscription = new Subscription();

	readonly localState$ = this.state.localState$;
	readonly currentUser$ = this.state.currentUser$;
	readonly isInEditMode$ = this.state.isInEditMode$;
	
	constructor(
		private readonly state: ProfileDetailsState
	) {}

	ngOnInit(): void {

		const loadProfileEffectSubs = this.state.loadProfileEffect();
		this.subscription.add(loadProfileEffectSubs);

		const editModeSubs = this.isInEditMode$.pipe(
			withLatestFrom(this.currentUser$),
			tap(([inEditMode, currentUser]) => {

				let timerId!: string | number | NodeJS.Timer | undefined;

				inEditMode && currentUser && (timerId = setTimeout(() => {
					this.editProfileForm.form.patchValue({
						username: currentUser.username,
						email: currentUser.email
					});
				}));
			})
		).subscribe();

		this.subscription.add(editModeSubs);
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	toggleEditMode() {
		const editModeToggleSubs = this.state.updateEditModeStatus();
		this.subscription.add(editModeToggleSubs);
	}

	submitHandler(formModel: NgForm) {
		const { username, email, profilePicture } = formModel.form.value;
		const userData: EditProfileDto = { username, email, profilePicture };

		const editProfileEffectSubs = this.state.editProfileEffect(userData);
		this.subscription.add(editProfileEffectSubs);
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
