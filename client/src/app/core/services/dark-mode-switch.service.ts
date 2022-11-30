import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { WINDOW } from 'src/app/shared/custom-di-tokens';
import { Store } from '@ngrx/store';
import { IRootState, toggleDarkMode } from 'src/app/+state';

@Injectable()
export class DarkModeSwitchService {

	private get colorSchemeDark(): MediaQueryList {
		return this.window.matchMedia('(prefers-color-scheme: dark)');
	}

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(WINDOW) private window: Window & typeof globalThis,
		private state: Store<IRootState>
	) { }

	onChanges(cb: (ev: MediaQueryListEvent) => void) {
		this.colorSchemeDark.addEventListener('change', cb);

		return () => {
			this.colorSchemeDark.removeEventListener('change', cb);
		}
	}

	
	getPreference(): string {

		return this.colorSchemeDark.matches ? 'dark' : 'light';
	}

	setPreference(theme: string): void {

		this.state.dispatch(toggleDarkMode({ darkModeOn: theme === 'dark' }));
	}

	setStyles(darkModeOn: boolean): void {

		this.document.body.classList.toggle('theme--dark', darkModeOn);
	}

}
