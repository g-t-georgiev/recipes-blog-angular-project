import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CoreModule } from './core/core.module';
import { HomeComponent } from './home/home.component';
import { StoreModule } from '@ngrx/store';
import { IRootState, darkModeReducer } from './+state';

@NgModule({
    declarations: [
        AppComponent,
        HomeComponent
    ],
    imports: [
        BrowserModule,
        AppRoutingModule,
        CoreModule,
        StoreModule.forRoot<IRootState>({
            darkModeOn: darkModeReducer
        }, {})
    ],
    providers: [],
    bootstrap: [AppComponent]
})
export class AppModule { }
