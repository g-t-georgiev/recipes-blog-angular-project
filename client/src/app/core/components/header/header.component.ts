import { Component, Inject, OnDestroy, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { WINDOW } from 'src/app/shared/custom-di-tokens';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

	private _showToggleBtn$: BehaviorSubject<boolean> = new BehaviorSubject(true);
	showToggleBtn$: Observable<boolean> = this._showToggleBtn$.asObservable();

	private get vpSizeChangeMQ(): MediaQueryList {
		return this.window.matchMedia('(max-width: 780px)');
	}

	private vpSizeChangeHandler: (ev: MediaQueryListEvent) => void = (vpSizeChangeEv) => {
		this._showToggleBtn$.next(vpSizeChangeEv.matches);
	};

	constructor(
		@Inject(WINDOW) private window: typeof globalThis & Window
	) { }

	ngOnInit(): void {
		this._showToggleBtn$.next(this.vpSizeChangeMQ.matches);
		
		this.vpSizeChangeMQ.addEventListener('change', this.vpSizeChangeHandler);
	}

	ngOnDestroy(): void {
		this.vpSizeChangeMQ.removeEventListener('change', this.vpSizeChangeHandler);
	}

	onMenuButtonToggle(value: boolean) {
		console.log(value);
	}
}
