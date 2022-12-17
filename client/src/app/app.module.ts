import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AuthService, DarkModeSwitchService as ThemeSwitchService, ViewportResizeService } from './core/services';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';

import { currentUser, IRootState, theme } from './state';


@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule, 
        HttpClientModule,
        AppRoutingModule,
        CoreModule.forRoot(),
        StoreModule.forRoot<IRootState>({
            darkModeOn: theme.reducers.darkModeReducer,
            currentUser: currentUser.reducers.currentUserReducer
        })
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (vpResizeService: ViewportResizeService) => {
                return function () {
                    vpResizeService.setStyles(
                        vpResizeService.hasMatch()
                    );
                }
            },
            multi: true,
            deps: [ViewportResizeService]
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (themeService: ThemeSwitchService) => {
                return function() {
                    themeService.setPreference(
                        themeService.getPreference()
                    );
                }
            },
            multi: true,
            deps: [ThemeSwitchService]
        },
        {
            provide: APP_INITIALIZER,
            useFactory: (authService: AuthService) => {
                return function () {
                    authService.authenticate$();
                }
            },
            multi: true,
            deps: [AuthService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
