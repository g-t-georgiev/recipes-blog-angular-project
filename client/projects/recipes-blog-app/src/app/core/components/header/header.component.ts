import { 
	Component, 
	OnInit, 
	OnDestroy, 
	AfterViewInit,
	ViewChild, 
	ElementRef 
} from '@angular/core';

import { Router } from '@angular/router';
import { Subscription, Observable, fromEvent } from 'rxjs';

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
export class HeaderComponent implements OnInit, AfterViewInit, OnDestroy {

	private subscription: Subscription = new Subscription();

	readonly currentUser$: Observable<IUser | null> = this.authService.currentUser$;
	readonly isLoggedIn$: Observable<boolean> = this.authService.isLoggedIn$;
	readonly localState$: Observable<ILocalState> = this.componentState.localState$;

	@ViewChild('headerEl') private readonly headerEl!: ElementRef<HTMLElement>;

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

	ngAfterViewInit(): void {

		this.subscription.add(
			this.componentState.collapseNavigationEffect(
				fromEvent<PointerEvent>(this.headerEl.nativeElement, 'pointerup')
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

}
