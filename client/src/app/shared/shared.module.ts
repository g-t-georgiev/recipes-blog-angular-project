import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DarkModeSwitchComponent } from './components/dark-mode-switch/dark-mode-switch.component';
import { FormsModule } from '@angular/forms';



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
	]
})
export class SharedModule { }
