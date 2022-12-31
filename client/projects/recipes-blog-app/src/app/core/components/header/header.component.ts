import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription, Observable } from 'rxjs';

import { AuthService } from '../../services';

import { IUser } from 'projects/recipes-blog-app/src/app/shared/interfaces';
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

	readonly currentUser$: Observable<IUser | null> = this.authService.currentUser$;
	readonly isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
	readonly localState$: Observable<ILocalState> = this.componentState.localState$;
	readonly signingOut$: Observable<boolean> = this.componentState.signingOut$;

	constructor(
		private readonly router: Router,
		private readonly authService: AuthService,
		private readonly vpResizeService: ViewportResizeService,
		private readonly componentState: HeaderComponentState, 
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

	isLinkActive(url: string): boolean {
		const queryParamsIndex = this.router.url.indexOf('?');
   		const baseUrl = queryParamsIndex === -1 ? this.router.url : 
   		this.router.url.slice(0, queryParamsIndex);
   		return baseUrl === url;
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
