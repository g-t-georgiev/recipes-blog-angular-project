import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';

import { currentUser, IRootState, theme } from './+state';

import { DarkModeSwitchService } from './core/services/dark-mode-switch.service';
import { ViewportResizeService } from './core/services/viewport-resize.service';
import { AuthService } from './core/services/auth.service';

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
            useFactory: (themeService: DarkModeSwitchService) => {
                return function() {
                    themeService.setPreference(
                        themeService.getPreference()
                    );
                }
            },
            multi: true,
            deps: [DarkModeSwitchService]
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
