import { 
	Component, 
	ViewChild, 
	ElementRef, 
	OnInit, 
	OnChanges,
	AfterViewInit, 
	Input,
	Output, 
	EventEmitter, 
	Renderer2, 
	SimpleChanges
} from '@angular/core';


enum ToggleBtnState {
	OPENED = 'opened',
	CLOSED = 'closed'
}

@Component({
	selector: 'app-menu-toggle-button',
	templateUrl: './menu-toggle-button.component.html',
	styleUrls: ['./menu-toggle-button.component.css']
})
export class MenuToggleButtonComponent implements OnInit, OnChanges, AfterViewInit {

	private toggleState: boolean = false; 
	private get btnTextValue(): ToggleBtnState {
		return this.toggleState ? ToggleBtnState.OPENED : ToggleBtnState.CLOSED;
	}

	@Input('is-smallScreen') private isOnSmallScreen: boolean = false;
	@Output('on-toggle') private onToggle: EventEmitter<boolean> = new EventEmitter();
	@ViewChild('menuToggleBtn') private menuToggleBtn!: ElementRef<HTMLButtonElement>;

	constructor(
		private renderer: Renderer2
	) { }

	ngOnInit(): void {
		// this.toggled = !this.isOnSmallScreen;
	}

	ngOnChanges(changes: SimpleChanges): void {
		console.log(changes);
	}

	ngAfterViewInit(): void {

		if (this.menuToggleBtn && this.menuToggleBtn.nativeElement) {

			this.renderer.setValue(
				this.menuToggleBtn.nativeElement,
				this.btnTextValue
			);

		}

	}



	toggleBtn(event: PointerEvent) {
		this.toggleState = !this.toggleState;
		
		const button = event.currentTarget as HTMLButtonElement;
		button.value = this.btnTextValue;
		this.onToggle.emit(this.toggleState);
	}

}