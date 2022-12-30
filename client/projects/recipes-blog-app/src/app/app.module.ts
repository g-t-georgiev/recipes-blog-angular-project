import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { StoreModule } from '@ngrx/store';
import { Observable } from 'rxjs';

import { AuthService, DarkModeSwitchService as ThemeSwitchService, IUserSignInResponse, ViewportResizeService } from './core/services';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';

import { currentUser, IRootState, theme } from './state';
import { NgrxRouterStoreModule } from './state/router';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule, 
        HttpClientModule,
        StoreModule.forRoot<IRootState>({
            darkModeOn: theme.reducers.darkModeReducer,
            currentUser: currentUser.reducers.currentUserReducer
        }),
        NgrxRouterStoreModule,
        AppRoutingModule,
        CoreModule.forRoot()
    ],
    providers: [
        {
            provide: APP_INITIALIZER,
            useFactory: (vpResizeService: ViewportResizeService) => {
                return function (): void {
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
                return function(): void {
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
                return function (): Observable<IUserSignInResponse> {
                    return authService.authenticate$();
                }
            },
            multi: true,
            deps: [AuthService]
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule { }
