import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { IRootState, darkModeReducer } from './+state';
import { DarkModeSwitchService } from './core/services/dark-mode-switch.service';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule.forRoot(),
        StoreModule.forRoot<IRootState>({
            darkModeOn: darkModeReducer
        })
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (themeService: DarkModeSwitchService) => {
                return function() {
                    themeService.switchDarkMode(
                        themeService.preferColorSchemeDarkMediaQuery.matches
                    );
                }
            },
            multi: true,
            deps: [DarkModeSwitchService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
