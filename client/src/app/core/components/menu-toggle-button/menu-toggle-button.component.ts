import { 
	Component, 
	Input, 
	Output, 
	EventEmitter,
	OnChanges, 
} from '@angular/core';

import { 
	BehaviorSubject, 
	Observable, 
} from 'rxjs';



enum ToggleNavButtonOptions {
	OPENED = 'opened',
	CLOSED = 'closed'
}

interface ILocalState {
	value: ToggleNavButtonOptions,
	toggled: boolean
};

@Component({
	selector: 'app-menu-toggle-button',
	templateUrl: './menu-toggle-button.component.html',
	styleUrls: ['./menu-toggle-button.component.css']
})
export class MenuToggleButtonComponent implements OnChanges {

	private _localState$: BehaviorSubject<ILocalState> = new BehaviorSubject<ILocalState>({
		toggled: false,
		value: ToggleNavButtonOptions.CLOSED
	});

	localState$: Observable<ILocalState> = this._localState$.asObservable();

	@Input('force-close') closeExplicitly: boolean = false; 
	@Output('on-toggle') private onToggle: EventEmitter<boolean> = new EventEmitter();

	ngOnChanges(): void {

		// console.log(
		// 	'MenuToggleButtonComponent#ngOnChanges', 
		// 	this.closeExplicitly
		// );

		if (this.closeExplicitly) {
			this.setState(!this.closeExplicitly);
		}

	}

	private setState(isToggled: boolean) {
		this._localState$.next({
			toggled: isToggled,
			value: isToggled ? ToggleNavButtonOptions.OPENED : ToggleNavButtonOptions.CLOSED
		});
	}

	toggle(isToggled: boolean) {
		this.setState(isToggled);
		this.onToggle.emit(isToggled);
	}

}