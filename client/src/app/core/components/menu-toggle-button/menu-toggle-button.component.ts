import { 
	Component, 
	Output, 
	EventEmitter,
	Input,
	OnInit,
	OnChanges,
	SimpleChanges, 
} from '@angular/core';



enum ToggleNavButtonOptions {
	OPENED = 'opened',
	CLOSED = 'closed'
}

@Component({
	selector: 'app-menu-toggle-button',
	templateUrl: './menu-toggle-button.component.html',
	styleUrls: ['./menu-toggle-button.component.css']
})
export class MenuToggleButtonComponent implements OnInit, OnChanges {

	toggled: boolean = false;
	btnTextValue: ToggleNavButtonOptions = ToggleNavButtonOptions.CLOSED;

	@Input('autoExpand') autoExpand: boolean = false;
	@Output('on-toggle') private onToggle: EventEmitter<boolean> = new EventEmitter();

	constructor() { }

	ngOnInit(): void {
		this.btnTextValue = this.toggled ? ToggleNavButtonOptions.OPENED : ToggleNavButtonOptions.CLOSED;
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
		console.log(this.autoExpand);
	}

	toggle() {
		this.toggled = !this.toggled;
		this.btnTextValue = this.toggled ? ToggleNavButtonOptions.OPENED : ToggleNavButtonOptions.CLOSED; 
		this.onToggle.emit(this.toggled);
	}

}