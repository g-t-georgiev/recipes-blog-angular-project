import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from './components/header/header.component';
import { DarkModeSwitchComponent } from './components/dark-mode-switch/dark-mode-switch.component';
import { MenuToggleButtonComponent } from './components/menu-toggle-button/menu-toggle-button.component';

import { DarkModeSwitchService } from './services/dark-mode-switch.service';
import { ViewportResizeService } from './services/viewport-resize.service';
import { AuthService } from './services/auth.service';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AttachCookieInterceptor, AuthInterceptor } from './interceptors';



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
				DarkModeSwitchService,
				ViewportResizeService, 
				AuthService
			]
		}
	}

}
