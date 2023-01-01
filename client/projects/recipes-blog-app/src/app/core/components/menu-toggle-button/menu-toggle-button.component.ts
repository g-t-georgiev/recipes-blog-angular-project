import { 
	AfterViewInit,
	Component, ElementRef, OnDestroy, ViewChild, 
} from '@angular/core';

import { 
	fromEvent,
	Observable, Subscription, 
} from 'rxjs';

import { HeaderComponentState } from '../header/header.component.state';



enum ToggleNavButtonOptions {
	OPENED = 'opened',
	CLOSED = 'closed'
}

@Component({
	selector: 'app-menu-toggle-button',
	templateUrl: './menu-toggle-button.component.html',
	styleUrls: ['./menu-toggle-button.component.css']
})
export class MenuToggleButtonComponent implements AfterViewInit, OnDestroy {

	private readonly subscription: Subscription = new Subscription();
	readonly showNavigation$: Observable<boolean> = this.componentState.showNavigation$;

	@ViewChild('toggleMenuBtnEl') private menuToggleBtnEl!: ElementRef<HTMLButtonElement>;

	constructor(
		private readonly componentState: HeaderComponentState
	) { }

	ngAfterViewInit(): void {
		this.subscription.add(
			this.componentState.toggleBtnClickEffect(
				fromEvent<PointerEvent>(this.menuToggleBtnEl.nativeElement, 'pointerup')
			)
		);
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

	getbtnTextValue(showNavigation: boolean): ToggleNavButtonOptions {
		return showNavigation ? ToggleNavButtonOptions.OPENED : ToggleNavButtonOptions.CLOSED;
	}

}