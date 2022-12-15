import { 
	Component, 
} from '@angular/core';

import { 
	Observable, 
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
export class MenuToggleButtonComponent {

	readonly showNavigation$: Observable<boolean> = this.state.showNavigation$;

	constructor(
		private readonly state: HeaderComponentState
	) { }

	getbtnTextValue(showNavigation: boolean): ToggleNavButtonOptions {
		return showNavigation ? ToggleNavButtonOptions.OPENED : ToggleNavButtonOptions.CLOSED;
	}

	toggleNavigation(showNavigation: boolean) {
		// console.log('Current navigation state: ', showNavigation ? 'opened' : 'closed');
		this.state.toggleNavigation(!showNavigation);
	}

}