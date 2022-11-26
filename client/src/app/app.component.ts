import { Component, OnDestroy, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { Subscription } from 'rxjs';
import { IRootState } from './+state';
import { DarkModeSwitchService } from './core/services/dark-mode-switch.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private themeService: DarkModeSwitchService,
        private state: Store<IRootState>
    ) { }

    ngOnInit(): void {

        this.state.select(globalState => globalState.darkModeOn).subscribe({
            next: (darkModeOn: boolean): void => {

                // console.log(
                //     'AppComponent#darkModeToggleSubscription', 
                //     `currentState: ${darkModeOn}`
                // );

                this.themeService.toggleThemeStyle(darkModeOn);
            }
        });

        this.themeService.preferColorSchemeDarkMediaQuery.addEventListener(
            'change', 
            ({ matches }) => this.themeService.switchDarkMode(matches)
        );

    }

}