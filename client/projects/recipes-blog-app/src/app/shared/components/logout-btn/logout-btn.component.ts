import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { fromEvent, Observable, Subscription } from 'rxjs';
import { LogoutBtnComponentState } from './logout-btn.component.state';

@Component({
	selector: 'app-logout-btn',
	templateUrl: './logout-btn.component.html',
	styleUrls: ['./logout-btn.component.css'],
	providers: [LogoutBtnComponentState]
})
export class LogoutBtnComponent implements OnInit, AfterViewInit, OnDestroy {
	
	private readonly subscription: Subscription = new Subscription();

	signingOut: boolean = false;
	private readonly signingOut$: Observable<boolean> = this.componentState.signingOut$;

	@ViewChild('logoutBtnEl') private readonly logoutBtnEl!: ElementRef<HTMLAnchorElement>;

	constructor(
		private readonly componentState: LogoutBtnComponentState
	) { }

	ngOnInit(): void {

		this.subscription.add(
			this.signingOut$.subscribe({
				next: (value) => {
					this.signingOut = value;
				}
			})
		);
		
	}

	ngAfterViewInit(): void {

		this.subscription.add(
			this.componentState.logoutInitEffect(
				fromEvent<PointerEvent>(this.logoutBtnEl.nativeElement, 'pointerup')
			)
		);
		
	}

	ngOnDestroy(): void {
		this.subscription?.unsubscribe?.();
	}

}
