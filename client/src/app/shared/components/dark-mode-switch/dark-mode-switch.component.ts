import { Component, OnDestroy, OnInit, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Store } from '@ngrx/store';
import { Observable, Subscription } from 'rxjs';
import { IRootState } from 'src/app/+state';
import { DarkModeSwitchService } from 'src/app/core/services/dark-mode-switch.service';

@Component({
	selector: 'app-dark-mode-switch',
	templateUrl: './dark-mode-switch.component.html',
	styleUrls: ['./dark-mode-switch.component.css']
})
export class DarkModeSwitchComponent implements OnInit, AfterViewInit, OnDestroy {

	@ViewChild('toggleThemeBtn') private toggleThemeBtn!: ElementRef<HTMLButtonElement>;

	isDarkModeOn$!: Observable<boolean>;

	private darkModeToggleSubscription!: Subscription;

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
	}


	toggleTheme(currentTheme: string): void {
		const toggledTheme = !(currentTheme === 'dark');
		this.themeService.switchDarkMode(toggledTheme);
	}

}
