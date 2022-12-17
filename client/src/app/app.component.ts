import { Component, OnInit } from '@angular/core';
import { Store } from '@ngrx/store';
import { tap } from 'rxjs/operators';

import { IRootState } from './state';
import { DarkModeSwitchService } from './core/services/dark-mode-switch.service';
import { ViewportResizeService } from './core/services/viewport-resize.service';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

    constructor(
        private vpResizeService: ViewportResizeService, 
        private themeService: DarkModeSwitchService, 
        private state: Store<IRootState>
    ) { }

    ngOnInit(): void {
		this.vpResizeService.onMaxWidth780$
			.pipe(
				tap(({ matches }) => {
					this.vpResizeService.setStyles(matches)
				}),
			).subscribe();

        this.state.select(
            (globalState) => globalState.darkModeOn
        ).pipe(
            tap((darkModeOn) => {
                this.themeService.setStyles(darkModeOn);
            })
        ).subscribe();

        this.themeService.onColorSchemeDark$.subscribe();
	}

}