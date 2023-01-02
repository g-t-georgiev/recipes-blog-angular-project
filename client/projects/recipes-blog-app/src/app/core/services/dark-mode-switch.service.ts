import { Injectable, Inject } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Observable, fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';
import { Store } from '@ngrx/store';

import { WINDOW } from 'projects/recipes-blog-app/src/app/shared/custom-di-tokens';
import { IRootState, theme as colorThemeStore } from 'projects/recipes-blog-app/src/app/+store';


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
		// console.log(this.colorSchemeDark.matches ? 'dark' : 'light');
		return this.colorSchemeDark.matches ? 'dark' : 'light';
	}

	setPreference(theme: string): void {
		// console.log(theme);
		this.state.dispatch(colorThemeStore.actions.toggleDarkMode({ darkModeOn: theme === 'dark' }));
	}

	setStyles(darkModeOn: boolean): void {
		// console.log(darkModeOn);
		this.document.body.classList.toggle('theme--dark', darkModeOn);
	}

}
