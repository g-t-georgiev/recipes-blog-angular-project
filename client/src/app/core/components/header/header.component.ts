import { 
	Component, 
	OnInit, 
	OnDestroy,  
} from '@angular/core';

import { 
	Subscription, 
	Observable, 
} from 'rxjs';

import { ViewportResizeService } from '../../services/viewport-resize.service';
import { HeaderState, ILocalState } from './header.state';



@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
	providers: [HeaderState]
})
export class HeaderComponent implements OnInit, OnDestroy {

	private subscription!: Subscription;

	readonly localState$: Observable<ILocalState> = this.state.localState$;

	constructor(
		private readonly vpResizeService: ViewportResizeService,
		private readonly state: HeaderState
	) { }

	ngOnInit(): void {
		this.state.toggleMenuBtnView(this.vpResizeService.hasMatch());
		this.state.toggleNavigationView(!this.vpResizeService.hasMatch());

		this.subscription = this.vpResizeService.onMaxWidth780$.subscribe({
			next: ({ matches }) => {
				this.state.toggleMenuBtnView(matches); // show toggle nav button on match
				this.state.toggleNavigationView(!matches); // hide navigation on match
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

		this.state.toggleNavigationView(false);

	}
}
