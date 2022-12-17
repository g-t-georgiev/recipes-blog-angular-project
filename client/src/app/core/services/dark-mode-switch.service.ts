import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WINDOW } from 'src/app/shared/custom-di-tokens';
import { IRootState, theme as colorThemeState } from 'src/app/state';


@Injectable()
export class DarkModeSwitchService {

	private colorSchemeDark!: MediaQueryList;

	onColorSchemeDark$!: Observable<MediaQueryListEvent>;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(WINDOW) private window: Window & typeof globalThis,
		private state: Store<IRootState>
	) { 
		this.colorSchemeDark = this.window.matchMedia('(prefers-color-scheme: dark)');
		this.onColorSchemeDark$ = fromEvent<MediaQueryListEvent>(this.colorSchemeDark, 'change').pipe(
			tap(({ matches }) => {
				this.setPreference(matches ? 'dark': 'light');
			})
		);
	}

	
	getPreference(): string {

		return this.colorSchemeDark.matches ? 'dark' : 'light';
	}

	setPreference(theme: string): void {

		this.state.dispatch(colorThemeState.actions.toggleDarkMode({ darkModeOn: theme === 'dark' }));
	}

	setStyles(darkModeOn: boolean): void {

		this.document.body.classList.toggle('theme--dark', darkModeOn);
	}

}
