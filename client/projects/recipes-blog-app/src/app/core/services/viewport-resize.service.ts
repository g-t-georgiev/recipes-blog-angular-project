import { DOCUMENT } from '@angular/common';

import { 
	Inject, 
	Injectable 
} from '@angular/core';

import { 
	Observable, 
	fromEvent, 
} from 'rxjs';

import { WINDOW } from 'projects/recipes-blog-app/src/app/shared/custom-di-tokens';



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
		this.onMaxWidth780$ = fromEvent<MediaQueryListEvent>(this.maxWidth780, 'change');
	}

	hasMatch(): boolean {
		return this.maxWidth780.matches;
	}

	setStyles(isMaxWidth780: boolean) {
		this.document.body.classList.toggle('maxwidth--780', isMaxWidth780);
	}

}