import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DarkModeSwitchComponent } from './components/dark-mode-switch/dark-mode-switch.component';



@NgModule({
	declarations: [
		DarkModeSwitchComponent,
	],
	imports: [
		CommonModule,
	],
	exports: [
		DarkModeSwitchComponent
	]
})
export class SharedModule { }
