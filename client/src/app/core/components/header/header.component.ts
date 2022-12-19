import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '@ngrx/store';

import { Subscription, Observable } from 'rxjs';

import { IRootState } from 'src/app/state';
import { IUser } from 'src/app/shared/interfaces';
import { ViewportResizeService } from '../../services/viewport-resize.service';
import { HeaderComponentState, ILocalState } from './header.component.state';



@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	providers: [HeaderComponentState]
})
export class HeaderComponent implements OnInit, OnDestroy {

	private subscription: Subscription = new Subscription();

	readonly currentUser$: Observable<IUser | null> = this.globalState.select((state) => state.currentUser);
	readonly localState$: Observable<ILocalState> = this.componentState.localState$;
	readonly signingOut$: Observable<boolean> = this.componentState.signingOut$;

	constructor(
		private readonly vpResizeService: ViewportResizeService,
		private readonly componentState: HeaderComponentState,
		private readonly globalState: Store<IRootState>
	) { }

	ngOnInit(): void {

		this.subscription.add(
			this.componentState.maxwidthMatchEffect(
				this.vpResizeService.hasMatch()
			)
		);

	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	onHeaderAreaClick(ev: PointerEvent, showNavigation: boolean) {

		if (
			!this.vpResizeService.hasMatch() ||
			!showNavigation
		) { 
			return; 
		}

		const tagName = (ev.target as HTMLElement).tagName;

		if ([ 
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
		) { 
			return; 
		}

		this.componentState.toggleNavigation(false);

	}

	logoutHandler() {
		this.subscription.add(
			this.componentState.logoutEffect()
		);
	}
}
