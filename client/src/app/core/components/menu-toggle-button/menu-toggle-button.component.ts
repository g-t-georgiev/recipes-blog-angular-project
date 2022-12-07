import { 
	Component, 
} from '@angular/core';

import { 
	Observable, 
} from 'rxjs';

import { HeaderState, ILocalState } from '../header/header.state';



enum ToggleNavButtonOptions {
	OPENED = 'opened',
	CLOSED = 'closed'
}

@Component({
	selector: 'app-menu-toggle-button',
	templateUrl: './menu-toggle-button.component.html',
	styleUrls: ['./menu-toggle-button.component.css']
})
export class MenuToggleButtonComponent {

	readonly localState$: Observable<ILocalState> = this.state.localState$;

	constructor(
		private readonly state: HeaderState
	) { }

	getbtnTextValue(showNavigation: boolean): ToggleNavButtonOptions {
		return showNavigation ? ToggleNavButtonOptions.OPENED : ToggleNavButtonOptions.CLOSED;
	}

	toggleNavigation(showNavigation: boolean) {
		this.state.toggleNavigationView(showNavigation);
	}

}