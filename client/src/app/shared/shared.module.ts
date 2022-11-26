import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeSwitchComponent } from './components/dark-mode-switch/dark-mode-switch.component';
import { FormsModule } from '@angular/forms';
import { WINDOW } from './custom-di-tokens';



@NgModule({
	declarations: [
		DarkModeSwitchComponent
	],
	imports: [
		CommonModule,
		FormsModule
	],
	exports: [
		DarkModeSwitchComponent
	],
	providers: [
		{
			provide: WINDOW,
			useValue: window ?? globalThis,
			multi: true 
		}
	]
})
export class SharedModule { }
