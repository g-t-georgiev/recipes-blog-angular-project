import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'src/app/shared/custom-di-tokens';
import { Store } from '@ngrx/store';
import { Observable } from 'rxjs';
import { IRootState, toggleDarkMode } from 'src/app/+state';

@Injectable()
export class DarkModeSwitchService {

	get preferColorSchemeDarkMediaQuery(): MediaQueryList {
		return this.window.matchMedia('(prefers-color-scheme: dark)');
	}

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(WINDOW) private window: Window & typeof globalThis,
		private state: Store<IRootState>
	) { }

	switchDarkMode(darkModeOn: boolean): void {

		// console.log(
		// 	'DarkModeSwitchService#switchDarkMode', 
		// 	`newState: ${darkModeOn}`
		// );

		if (typeof darkModeOn === 'boolean') {
			this.state.dispatch(toggleDarkMode({ darkModeOn }));
		}
	}

	toggleThemeStyle(darkModeOn: boolean): void {

		// console.log(
		// 	'DarkModeSwitchService#toggleThemeStyle', 
		// 	`toggleStyles: ${darkModeOn}`
		// );

		this.document.body.classList.toggle('theme--dark', darkModeOn);
	}

}
