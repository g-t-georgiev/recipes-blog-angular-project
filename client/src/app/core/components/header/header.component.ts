import { Component, Inject, OnDestroy, OnInit } from '@angular/core';

import { WINDOW } from 'src/app/shared/custom-di-tokens';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {

	showMenuToggleBtn: boolean = false;

	private get vpSizeChangeMQ(): MediaQueryList {
		return this.window.matchMedia('(max-width: 780px)');
	}

	private vpSizeChangeHandler: (ev: MediaQueryListEvent) => void = (vpSizeChangeEv) => {
		this.showMenuToggleBtn = vpSizeChangeEv.matches;
	};

	constructor(
		@Inject(WINDOW) private window: typeof globalThis & Window
	) { }

	ngOnInit(): void {
		this.vpSizeChangeMQ.addEventListener('change', this.vpSizeChangeHandler);
	}

	ngOnDestroy(): void {
		this.vpSizeChangeMQ.removeEventListener('change', this.vpSizeChangeHandler);
	}

}
