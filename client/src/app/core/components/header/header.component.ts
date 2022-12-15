import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Store } from '@ngrx/store';

import { Subscription, Observable } from 'rxjs';

import { IRootState } from 'src/app/+state';
import { IUser } from 'src/app/shared/interfaces';
import { AuthService } from '../../services';
import { ViewportResizeService } from '../../services/viewport-resize.service';
import { HeaderComponentState, ILocalState } from './header.component.state';



@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	providers: [HeaderComponentState]
})
export class HeaderComponent implements OnInit, OnDestroy {

	private subscription!: Subscription;

	readonly currentUser$: Observable<IUser | null> = this.globalState.select((state) => state.currentUser);
	readonly localState$: Observable<ILocalState> = this.componentState.localState$;
	readonly signingOut$: Observable<boolean> = this.componentState.signingOut$;

	constructor(
		private readonly vpResizeService: ViewportResizeService,
		private readonly componentState: HeaderComponentState,
		private readonly globalState: Store<IRootState>,
		private readonly authService: AuthService,
		private readonly router: Router
	) { }

	ngOnInit(): void {
		this.componentState.updateMenuBtnToggleState(this.vpResizeService.hasMatch());
		this.componentState.toggleNavigation(!this.vpResizeService.hasMatch());

		this.subscription = this.vpResizeService.onMaxWidth780$.subscribe({
			next: ({ matches }) => {
				this.componentState.updateMenuBtnToggleState(matches); // show toggle nav button on match
				this.componentState.toggleNavigation(!matches); // hide navigation on match
			}
		});
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe();
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
		this.componentState.updateSignoutStatus(true);

		this.authService.logout$().subscribe({
			next: ({ message }) => {
				console.log(message);
			},
			complete: () => {
				this.componentState.updateSignoutStatus(false);
				this.router.navigate(['/users', 'login']);
			},
			error: ({ error }) => {
				console.error(error?.message ?? 'Something went wrong');
				this.componentState.updateSignoutStatus(false);
			}
		});
	}
}
