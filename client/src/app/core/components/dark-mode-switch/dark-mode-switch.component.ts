import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';

import { IRootState } from 'src/app/+state';
import { DarkModeSwitchService } from '../../services/dark-mode-switch.service';

@Component({
	selector: 'app-dark-mode-switch',
	templateUrl: './dark-mode-switch.component.html',
	styleUrls: ['./dark-mode-switch.component.css']
})
export class DarkModeSwitchComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('toggleThemeBtn') private toggleThemeBtn!: ElementRef<HTMLButtonElement>;

	isDarkModeOn$!: Observable<boolean>;

	private darkModeToggleSubscription!: Subscription;
	private colorSchemeChangeSubscription!: Subscription;

	constructor(
		private themeService: DarkModeSwitchService,
		private state: Store<IRootState>
	) {
		
		this.isDarkModeOn$ = this.state.select(globalState => globalState.darkModeOn);
	}

	ngOnInit(): void { }

	ngAfterViewInit(): void {

		this.darkModeToggleSubscription = this.isDarkModeOn$.subscribe({
			next: (value) => {
				const { nativeElement: toggleBtn } = this.toggleThemeBtn; 
				const selectedTheme = value ? 'dark' : 'light';
				toggleBtn.setAttribute('aria-label', selectedTheme);
				toggleBtn.value = selectedTheme;
			}
		});

	}

	ngOnDestroy(): void {
		this.darkModeToggleSubscription.unsubscribe?.();
		this.colorSchemeChangeSubscription.unsubscribe?.();
	}


	toggleTheme(event: PointerEvent): void {
		const button = event.currentTarget as HTMLButtonElement;
		const currentTheme = button.value;
		// console.log('Current: ', currentTheme);
		const toggledTheme = currentTheme === 'dark' ? 'light' : 'dark';
		// console.log('Next: ', toggledTheme);
		this.themeService.setPreference(toggledTheme);
	}

}
