import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { IRootState } from 'src/app/+state';
import { DarkModeSwitchService } from 'src/app/core/services/dark-mode-switch.service';

@Component({
	selector: 'app-dark-mode-switch',
	templateUrl: './dark-mode-switch.component.html',
	styleUrls: ['./dark-mode-switch.component.css']
})
export class DarkModeSwitchComponent implements OnInit, OnDestroy {

	isDarkModeOn$!: Observable<boolean>;

	private darkModeToggleSubscription!: Subscription;

	constructor(
		private themeService: DarkModeSwitchService,
		private state: Store<IRootState>
	) {
		
		this.isDarkModeOn$ = this.state.select(globalState => globalState.darkModeOn);
	}

	ngOnInit(): void {

		this.darkModeToggleSubscription = this.isDarkModeOn$.subscribe();
	}


	ngOnDestroy(): void {

		this.darkModeToggleSubscription.unsubscribe?.();
	}

}
