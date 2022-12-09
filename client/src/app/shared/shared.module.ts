import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LogoPlaceholderComponent } from './components/logo-placeholder/logo-placeholder.component';



@NgModule({
	declarations: [
    	LogoPlaceholderComponent
  ],
	imports: [
		CommonModule,
	],
	exports: [
		LogoPlaceholderComponent
	]
})
export class SharedModule { }
