import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { AttachCookieInterceptor, AuthInterceptor } from './interceptors';
import { AuthService, DarkModeSwitchService as ThemeSwitchService, ViewportResizeService } from './services';

import { HeaderComponent } from './components/header/header.component';
import { DarkModeSwitchComponent } from './components/dark-mode-switch/dark-mode-switch.component';
import { MenuToggleButtonComponent } from './components/menu-toggle-button/menu-toggle-button.component';



@NgModule({
	declarations: [
		HeaderComponent, 
		DarkModeSwitchComponent,
  		MenuToggleButtonComponent
	],
	imports: [
		CommonModule,
		RouterModule,
		SharedModule
	],
	exports: [
		HeaderComponent
	]
})
export class CoreModule {

	static forRoot(): ModuleWithProviders<CoreModule> {
		return {
			ngModule: CoreModule,
			providers: [
				{
					provide: HTTP_INTERCEPTORS,
					useClass: AuthInterceptor,
					multi: true
				},
				{
					provide: HTTP_INTERCEPTORS,
					useClass: AttachCookieInterceptor,
					multi: true
				},
				ThemeSwitchService,
				ViewportResizeService, 
				AuthService
			]
		}
	}

}
