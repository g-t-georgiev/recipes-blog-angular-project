import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'src/app/shared/custom-di-tokens';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IRootState, selectDarkModeFeatureValue, toggleDarkMode } from 'src/app/+state';

@Injectable()
export class DarkModeSwitchService {

	isDarkModeOn$!: Observable<boolean>;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(WINDOW) private window: Window | typeof globalThis,
		private state: Store<IRootState>
	) {
		this.isDarkModeOn$ = this.state.select(selectDarkModeFeatureValue);
	}

	switchDarkMode(darkModeOn: boolean): void {
		this.state.dispatch(toggleDarkMode({ darkModeOn }));
	}

	toggleThemeStyle(darkModeOn: boolean): void {
		this.document.body.classList.toggle('theme--dark', darkModeOn);
	}

}
