import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';
import { Observable, fromEvent } from 'rxjs';
import { tap } from 'rxjs/operators';

import { WINDOW } from 'src/app/shared/custom-di-tokens';

enum MediaQueries {
	MaxWidth780 = '(max-width: 780px)'
}

@Injectable()
export class ViewportResizeService {

	private maxWidth780!: MediaQueryList;
	onMaxWidth780$!: Observable<MediaQueryListEvent>;

	constructor(
		@Inject(DOCUMENT) private document: Document,
		@Inject(WINDOW) private window: typeof globalThis & Window
	) {
		this.maxWidth780 = this.window.matchMedia(MediaQueries.MaxWidth780);
		this.onMaxWidth780$ = fromEvent<MediaQueryListEvent>(this.maxWidth780, 'change').pipe(
			tap(({ matches }) => {
				this.setStyles(matches);
			})
		);
	}

	hasMatch(): boolean {
		return this.maxWidth780.matches;
	}

	init(): void {
		this.setStyles(
			this.maxWidth780.matches
		);
	}


	
	private setStyles(isMaxWidth780: boolean) {
		this.document.body.classList.toggle('maxwidth--780', isMaxWidth780);
	}

}