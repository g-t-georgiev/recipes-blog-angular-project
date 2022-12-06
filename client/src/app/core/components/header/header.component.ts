import { 
	Component, 
	OnInit, 
	OnDestroy, 
	HostBinding,  
} from '@angular/core';

import { 
	Subscription, 
	BehaviorSubject, 
	Observable, 
} from 'rxjs';

import { ViewportResizeService } from '../../services/viewport-resize.service';



interface ILocalState {
	toggleNavigation: boolean,
	showToggleBtn: boolean,
	expandHeader: boolean, 
	forceClose: boolean
}

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

	private subscription!: Subscription;

	private _localState$: BehaviorSubject<ILocalState> = new BehaviorSubject<ILocalState>({
		toggleNavigation: true,
		showToggleBtn: false,
		expandHeader: false, 
		forceClose: false
	});

	localState$: Observable<ILocalState> = this._localState$.asObservable();

	constructor(
		private vpResizeService: ViewportResizeService
	) { }

	ngOnInit(): void {
		this.setState(
			!this.vpResizeService.hasMatch(), // hide navigation on match
			this.vpResizeService.hasMatch(), // show toggle nav button on match
			false, // do not expand header on fullscreen by default
			false // do not force close navigation by default
		);

		this.subscription = this.vpResizeService.onMaxWidth780$.subscribe({
			next: ({ matches }) => {
				this.setState(
					!matches, // hide navigation on match
					matches, // show toggle nav button on match
					false, // do not expand header on fullscreen by default
					false // do not force close navigation by default
				);
			}
		});
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
	}

	private setState(toggleNavigation: boolean, showToggleBtn: boolean, expandHeader: boolean, forceClose: boolean) {
		this._localState$.next({
			toggleNavigation,
			showToggleBtn,
			expandHeader,
			forceClose
		});
	}

	onMenuButtonToggle(menuBtnToggled: boolean) {
		this.setState(
			menuBtnToggled, // hide navigation on toggle
			true, // show togle button by default
			menuBtnToggled, // expand header fullscreen on toggle
			false // do not force close navigation by default
		);
	}

	onHeaderAreaClick(ev: PointerEvent, isHeaderExpanded: boolean) {
		if (!isHeaderExpanded) { return; }

		const tagName = (ev.target as HTMLElement).tagName;

		// console.log(tagName);

		if (
			[ 
				'APP-MENU-TOGGLE-BUTTON', 
				'APP-DARK-MODE-SWITCH', 
				'BUTTON', 
				'svg', 
				'line',
				'circle', 
				'rect', 
				'mask', 
				'g'
			].includes(tagName)
		) { return; }

		this.setState(
			false, // hide navigation 
			true, // show toggle button 
			false, // collapse header to normalse size
			true // force close navigation 
		);
	}
}
