import { Component, Inject, OnDestroy, OnInit, ViewChild, AfterViewInit, ElementRef } from '@angular/core';
import { BehaviorSubject, Observable, Subscription } from 'rxjs';

import { WINDOW } from 'src/app/shared/custom-di-tokens';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy, AfterViewInit {

	@ViewChild('menuToggleBtn') private menuToggleBtn!: ElementRef<HTMLButtonElement>;

	private _showToggleBtn$: BehaviorSubject<boolean> = new BehaviorSubject(true);
	showToggleBtn$: Observable<boolean> = this._showToggleBtn$.asObservable();

	private _navToggledState$: BehaviorSubject<string> = new BehaviorSubject('closed');
	navToggledState$: Observable<string> = this._navToggledState$.asObservable();

	private navToggleSubscription!: Subscription;

	private get vpSizeChangeMQ(): MediaQueryList {
		return this.window.matchMedia('(max-width: 780px)');
	}

	private vpSizeChangeHandler: (ev: MediaQueryListEvent) => void = (vpSizeChangeEv) => {
		this._showToggleBtn$.next(vpSizeChangeEv.matches);
		this._navToggledState$.next(vpSizeChangeEv.matches ? 'closed' : 'opened');
	};

	constructor(
		@Inject(WINDOW) private window: typeof globalThis & Window
	) { }

	ngOnInit(): void {
		this.vpSizeChangeMQ.addEventListener('change', this.vpSizeChangeHandler);
	}

	ngAfterViewInit(): void {
		this.navToggleSubscription = this.navToggledState$
			.subscribe({
				next: (nextToggleStateValue) => {
					if (this.menuToggleBtn && this.menuToggleBtn.nativeElement) {
						this.menuToggleBtn.nativeElement.value = nextToggleStateValue;
					}
				}
			});
	}

	ngOnDestroy(): void {
		this.vpSizeChangeMQ.removeEventListener('change', this.vpSizeChangeHandler);
		this.navToggleSubscription?.unsubscribe();
	}

	toggleNavState(event: PointerEvent) {
		const button = event.currentTarget as HTMLButtonElement;
		const currentBtnValue = button.value;
		const toggledBtnValue = currentBtnValue === 'closed' ? 'opened' : 'closed';
		this._navToggledState$.next(toggledBtnValue);
	}

}
