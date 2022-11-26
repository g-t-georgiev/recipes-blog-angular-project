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

	form!: FormGroup;

	isDarkModeOn$!: Observable<boolean>;

	private formValueChangesSubscription!: Subscription;
	private darkModeToggleSubscription!: Subscription;

	constructor(
		private themeService: DarkModeSwitchService,
		private state: Store<IRootState>
	) {
		this.isDarkModeOn$ = this.state.select(globalState => globalState.darkModeOn);

		this.form = new FormGroup({
			darkModeOn: new FormControl(null)
		});
	
	}

	ngOnInit(): void {

		this.darkModeToggleSubscription = this.isDarkModeOn$.subscribe({
			next: (darkModeOn: boolean): void => {

				// console.log(
				// 	'DarkModeSwitchComponent#ngOninit', 
				// 	`currentState: ${darkModeOn}`
				// );
				
				if (this.form.get('darkModeOn')?.value !== darkModeOn) {

					// console.log(
					// 	'DarkModeSwitchComponent#ngOninit', 
					// 	`currentFormControlValue: ${this.form.get('darkModeOn')?.value}`,
					// 	`newFormControlValue: ${darkModeOn}`
					// );

					this.form.patchValue({ darkModeOn });
				}
				
			}
		});

		this.formValueChangesSubscription = this.form.valueChanges.subscribe({
			next: ({ darkModeOn }) => {
				this.themeService.switchDarkMode(darkModeOn);
			}
		});
		
	}


	ngOnDestroy(): void {
		this.darkModeToggleSubscription.unsubscribe?.();
		this.formValueChangesSubscription
	}

}
