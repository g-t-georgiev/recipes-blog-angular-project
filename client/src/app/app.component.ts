import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { DarkModeSwitchService } from './core/services/dark-mode-switch.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

    private darkModeToggleSubscription!: Subscription;

    constructor(
        private themeService: DarkModeSwitchService
    ) { }

    ngOnInit(): void {

        this.darkModeToggleSubscription = this.themeService.isDarkModeOn$.subscribe({
            next: (darkModeOn: boolean): void => {
                this.themeService.toggleThemeStyle(darkModeOn);
            }
        });

    }

    ngOnDestroy(): void {
        this.darkModeToggleSubscription.unsubscribe?.();
    }

}