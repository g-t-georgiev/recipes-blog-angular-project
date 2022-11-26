import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeSwitchComponent } from './components/dark-mode-switch/dark-mode-switch.component';
import { ReactiveFormsModule } from '@angular/forms';
import { WINDOW } from './custom-di-tokens';



@NgModule({
	declarations: [
		DarkModeSwitchComponent
	],
	imports: [
		CommonModule,
		ReactiveFormsModule
	],
	exports: [
		DarkModeSwitchComponent
	]
})
export class SharedModule { }
