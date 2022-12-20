import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { AttachCookieInterceptor, AuthInterceptor } from './interceptors';

import { 
	AuthService, 
	DarkModeSwitchService as ThemeSwitchService, 
	UsersService, 
	ViewportResizeService 
} from './services';

import { 
	HeaderComponent, 
	DarkModeSwitchComponent, 
	MenuToggleButtonComponent 
} from './components';

import { AuthGuard } from './guards';



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
				AuthService,
				AuthGuard,
				UsersService
			]
		}
	}

}
