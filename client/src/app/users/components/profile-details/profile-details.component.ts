import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ProfileDetailsState } from './profile-details.component.state';

@Component({
	selector: 'app-profile-details',
	templateUrl: './profile-details.component.html',
	styleUrls: ['./profile-details.component.css'],
	providers: [ProfileDetailsState]
})
export class ProfileDetailsComponent implements OnInit, OnDestroy {

	private readonly subscription = new Subscription();

	readonly currentUserDetails$ = this.state.currentUserDetails$;
	readonly isLoading$ = this.state.isLoading$;
	readonly errorHappened$ = this.state.errorHappened$;
	readonly message$ = this.state.message$;
	readonly isInEditMode$ = this.state.isInEditMode$;
	
	constructor(
		private readonly state: ProfileDetailsState
	) {}

	ngOnInit(): void {
		this.subscription.add(
			this.state.loadProfileDetails()
		)
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

}
