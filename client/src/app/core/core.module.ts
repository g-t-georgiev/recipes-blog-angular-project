import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { RouterModule } from '@angular/router';
import { SharedModule } from '../shared/shared.module';

import { HeaderComponent } from './components/header/header.component';

import { DarkModeSwitchService } from './services/dark-mode-switch.service';



@NgModule({
	declarations: [
		HeaderComponent
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
				DarkModeSwitchService,
			]
		}
	}

}
